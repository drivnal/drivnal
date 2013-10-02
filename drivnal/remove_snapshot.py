from constants import *
from exec_task import ExecTask
from event import Event
import os
import time
import shlex
import logging
import shutil
import subprocess

logger = logging.getLogger(APP_NAME)

class RemoveSnapshot(ExecTask):
    type = REMOVE_SNAPSHOT

    def _pre_aborted(self):
        self.snapshot.set_state(FAILED)

    def run(self, keep_log=False):
        self.snapshot.set_state(REMOVING)
        Event(volume_id=self.volume_id, type=SNAPSHOTS_UPDATED)

        if not keep_log:
            logger.debug('Removing snapshot log file. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })

            if os.path.isfile(self.snapshot.log_path):
                os.remove(self.snapshot.log_path)

        logger.debug('Removing snapshot directory. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
            'task_id': self.id,
        })

        args = ['rm', '-rf', self.snapshot.path]
        self._exec(args)

    def post_run(self):
        Event(volume_id=self.volume_id, type=SNAPSHOTS_UPDATED)
