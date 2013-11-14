from constants import *
from exec_task import ExecTask
from event import Event
import os
import time
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class RestoreObject(ExecTask):
    type = RESTORE_OBJECT

    def run(self, objects, destination_path):
        logger.info('Restoring objects. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })

        self.log_path = os.path.join(self.volume.path,
            LOG_DIR, 'restore_%s.log' % int(time.time()))

        for obj in objects:
            args = ['rsync', '--archive', '--hard-links', '--acls',
                '--quiet', '--xattrs',  '--progress', '--stats', '--super',
                '--log-file-format=%o \"%f\" %l',
                '--log-file=%s' % self.log_path,
                obj.path, destination_path]

            return_code = self._exec(args)
            if return_code is None:
                return

            if return_code != 0:
                raise OSError('Object restore failed, command ' + \
                    'returned non-zero exit status. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': snapshot_id,
                    })

    def post_run(self):
        Event(volume_id=self.volume_id, type=ORIGIN_UPDATED)
