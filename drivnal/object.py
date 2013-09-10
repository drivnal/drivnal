from constants import *
import os
import stat
import urllib
import subprocess
import logging

logger = logging.getLogger(APP_NAME)

class Object:
    def __init__(self, path):
        self.name = os.path.basename(path)
        self.path = path
        self.syntax = None
        self.readable = False

        if os.path.isdir(self.path):
            self.type = DIR_MIME_TYPE
            self.size = None
            self.time = None
        else:
            try:
                file_stat = os.stat(self.path)
                self.size = file_stat.st_size
                self.time = int(file_stat.st_mtime)
                self.readable = bool(file_stat.st_mode & stat.S_IROTH)
            except OSError:
                self.size = None
                self.time = None
            self.type = None

    def get_mime_type(self):
        if not self.type:
            try:
                # TODO Follow symlinks
                self.type = subprocess.check_output(['file',
                    '--mime-type', '--brief', self.path]).strip()
            except subprocess.CalledProcessError, error:
                logger.debug('File mime-type call failed. %r' % {
                    'return_code': error.returncode,
                    'output': error.output,
                })
        return self.type

    def get_syntax(self):
        if self.type == DIR_MIME_TYPE:
            return

        extension = os.path.splitext(self.path)[1].lower().replace('.', '')
        if extension in EXTENSION_TYPES:
            self.syntax = EXTENSION_TYPES[extension]
            return self.syntax

        for match, syntax, match_type in FILENAME_TYPES:
            name = self.name.lower()

            if match_type == MATCH_ALL:
                if match in name:
                    self.syntax = syntax
                    return self.syntax
                continue

            if match_type == MATCH_BOTH or match_type == MATCH_PREFIX:
                if name.startswith(match):
                    self.syntax = syntax
                    return self.syntax
                if match_type == MATCH_PREFIX:
                    continue

            if name.endswith(match):
                self.syntax = syntax
                return self.syntax

        if self.get_mime_type():
            for mime_type, syntax in MIME_TYPES:
                if mime_type in self.type.lower():
                    self.syntax = syntax
                    return self.syntax

    def read(self):
        # TODO
        # if self.readable:
        #     return

        if not self.syntax:
            return

        try:
            with open(self.path) as file_data:
                return file_data.read()
        except OSError, error:
            logger.warning('Failed to read file. %r' % {
                'error': error,
            })
            return

    @staticmethod
    def get_objects(path):
        objects = []
        object_paths = []

        if path:
            for name in os.listdir(path):
                object_path = os.path.join(path, name)
                object = Object(object_path)
                objects.append(object)
                if not object.type:
                    object_paths.append(object_path)

        # Attempt to get all mime types with one call get_syntax will
        # call again if this fails
        try:
            # TODO Follow symlinks
            mime_types = subprocess.check_output(['file',
                '--mime-type', '--brief'] + object_paths).splitlines()
        except subprocess.CalledProcessError, error:
            logger.debug('File mime-type call failed. %r' % {
                'return_code': error.returncode,
                'output': error.output,
            })

        try:
            for object in objects:
                if not object.type:
                    object.type = mime_types.pop(0)
        except IndexError:
            logger.error('File mime-type call index error.')

        for object in objects:
            object.get_syntax()

        return objects
