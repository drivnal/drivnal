from constants import *
from core_snapshot import CoreSnapshot
import logging

logger = logging.getLogger(APP_NAME)

class RemoteSnapshot(CoreSnapshot):
    def _get_path(self):
        dir_name = str(self.id)
        if self.state != COMPLETE:
            dir_name = '%s.%s' % (dir_name, self.state)
        return '%s@%s%s' % (self.volume.ssh_user, self.volume.ssh_path,
            os.sep + os.path.join(SNAPSHOT_DIR, dir_name) + os.sep)

    def _get_log_path(self):
        return os.path.join(self.volume.log_dir, 'snapshot_%s.log' % self.id)

    def _setup_snapshot(self, last_snapshot):
        pass

    def set_state(self, state):
        if self.state == state:
            return
        self.state = state
