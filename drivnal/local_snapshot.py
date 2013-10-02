from constants import *
from core_snapshot import CoreSnapshot
import os
import logging

logger = logging.getLogger(APP_NAME)

class LocalSnapshot(CoreSnapshot):
    def _get_path(self):
        dir_name = str(self.id)
        if self.state != COMPLETE:
            dir_name = '%s.%s' % (dir_name, self.state)
        return os.path.join(self.volume.path, SNAPSHOT_DIR, dir_name) + os.sep

    def _get_log_path(self):
        return os.path.join(self.volume.log_dir, 'snapshot_%s.log' % self.id)

    def _setup_snapshot(self, last_snapshot):
        snapshots_path = os.path.dirname(self.path)
        if not os.path.isdir(snapshots_path):
            logger.debug('Creating volume snapshots directory. %r' % {
                'volume_id': self.volume.id,
                'snapshot_id': self.id,
            })
            os.makedirs(snapshots_path)

        logs_path = os.path.dirname(self.log_path)
        if not os.path.isdir(logs_path):
            logger.debug('Creating volume logs directory. %r' % {
                'volume_id': self.volume.id,
                'snapshot_id': self.id,
            })
            os.makedirs(logs_path)

        if last_snapshot:
            return ['--link-dest=%s' % last_snapshot.path]

    def set_state(self, state):
        if self.state == state:
            return

        orig_state = self.state
        orig_path = self.path
        self.state = state

        try:
            os.rename(orig_path, self.path)
        except OSError:
            logger.exception('Unable to change snapshot state. %r' % {
                'volume_id': self.volume.id,
                'snapshot_id': self.id,
                'state': self.state,
            })
            self.state = orig_state
