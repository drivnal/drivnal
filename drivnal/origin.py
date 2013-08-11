from constants import *
from bucket import Bucket
import logging

class Origin(Bucket):
    def __init__(self, volume):
        self.volume = volume
        self.path = self.volume.source_path
