from drivnal.constants import *
import os
import urllib
import mimetypes
import logging

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
                stat = os.stat(self.path)
                self.size = stat.st_size
                self.time = stat.st_mtime
            except OSError:
                self.size = None
                self.time = None

            mime = mimetypes.MimeTypes()
            self.type = mime.guess_type(urllib.pathname2url(self.path))[0]

    @staticmethod
    def get_objects(path):
        objects = []

        if path:
            for name in os.listdir(path):
                object_path = os.path.join(path, name)
                objects.append(Object(object_path))

        return objects
