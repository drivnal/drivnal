from constants import *
from object import Object
import os
import logging

class Bucket:
    def __init__(self, path):
        self.path = path

    def get_object(self, path):
        return Object(os.path.join(self.path, path))

    def get_objects(self, path=None):
        if path:
            return Object.get_objects(os.path.join(self.path, path))
        else:
            return Object.get_objects(self.path)
