from constants import *
from core_volume import CoreVolume
from remote_snapshot import RemoteSnapshot
import os
import logging

logger = logging.getLogger(APP_NAME)

class RemoteVolume(CoreVolume):
    SnapshotClass = RemoteSnapshot

    def _get_log_dir(self):
        return './'

    def _get_auto_excludes(self):
        pass

    def _move_available(self, source_path, destination_path):
        return True

    def _copy_available(self, source_path, destination_path):
        return True

    def get_space_free(self):
        return 1

    def list_path(self, path, files=True, dirs=True):
        return []
