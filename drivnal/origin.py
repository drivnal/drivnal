from constants import *
from bucket import Bucket
import logging

class Origin(Bucket):
    def __init__(self, volume):
        self.path = volume.source_path
