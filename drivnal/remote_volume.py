from constants import *
from core_volume import CoreVolume
from remote_snapshot import RemoteSnapshot
import os
import logging

logger = logging.getLogger(APP_NAME)

class RemoteVolume(CoreVolume):
    SnapshotClass = RemoteSnapshot

    def get_space_free(self):
        return 1

    def list_path(self, path, files=True, dirs=True):
        return []

    def get_auto_excludes(self):
        pass
