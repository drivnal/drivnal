from constants import *
from core_volume import CoreVolume
from local_snapshot import LocalSnapshot
import os
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class LocalVolume(CoreVolume):
    SnapshotClass = LocalSnapshot

    def _get_log_dir(self):
        return os.path.join(self.path, LOG_DIR)

    def _get_auto_excludes(self):
        source_path = self.source_path
        if source_path[-1] != os.sep:
            source_path += os.sep

        # If volume is a subdirectory of source path exclude path
        if os.path.commonprefix([source_path, self.path]) == source_path:
            logger.debug('Auto excluding volume path from snapshot. %r' % {
                'volume_id': self.id,
            })
            path = os.sep + os.path.normpath(self.path.replace(
                source_path, '', 1)) + os.sep
            return [path]

    def _get_mount(self, path):
        output = subprocess.check_output(['df', '-P', path])
        return output.strip().split(' ')[-1]

    def _move_available(self, source_path, destination_path):
        return self._get_mount(source_path) == self._get_mount(
            destination_path)

    def _copy_available(self, source_path, destination_path):
        return True

    def get_space_free(self):
        stat = os.statvfs(self.path)
        return float(stat.f_bavail) / stat.f_blocks

    def list_path(self, path, files=True, dirs=True):
        path = os.path.join(self.path, path)
        names = []

        if not os.path.isdir(path):
            return names

        for name in os.listdir(path):
            if files and dirs:
                pass
            elif not files and dirs:
                if not os.path.isdir(os.path.join(path, name)):
                    continue
            elif files and not dirs:
                if not os.path.isfile(os.path.join(path, name)):
                    continue
            else:
                continue
            names.append(name)

        return names
