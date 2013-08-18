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

        if os.path.isdir(self.path):
            self.type = DIR_MIME_TYPE
            self.size = None
            self.time = None
        else:
            try:
                file_stat = os.stat(self.path)
                self.size = file_stat.st_size
                self.time = file_stat.st_mtime
                self.readable = bool(file_stat.st_mode & stat.S_IROTH)
            except OSError:
                self.size = None
                self.time = None
                self.readable = False
            self.type = None

    def get_mime_type(self):
        try:
            # TODO Follow symlinks
            self.type = subprocess.check_output(['file',
                '--mime-type', '--brief', self.path]).strip()
        except subprocess.CalledProcessError, error:
            logger.warning('File mime-type call failed. %r' % {
                'return_code': error.returncode,
                'output': error.output,
            })

    def read(self):
        # TODO
        # if self.readable:
        #     return None

        try:
            with open(self.path) as file_data:
                return file_data.read()
        except OSError, error:
            logger.warning('Failed to read file. %r' % {
                'error': error,
            })
            return None

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

        try:
            # TODO Follow symlinks
            mime_types = subprocess.check_output(['file',
                '--mime-type', '--brief'] + object_paths).splitlines()
        except subprocess.CalledProcessError, error:
            logger.warning('File mime-type call failed. %r' % {
                'return_code': error.returncode,
                'output': error.output,
            })

        try:
            for object in objects:
                if not object.type:
                    object.type = mime_types.pop(0)
        except IndexError:
            logger.error('File mime-type call index error.')

        return objects
