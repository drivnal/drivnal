from constants import *
from exceptions import *
from task import Task
from event import Event
import os
import time
import shlex
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class ExecTask(Task):
    def _pre_aborted(self):
        pass

    def _post_aborted(self):
        pass

    def _abort_process(self):
        for i in xrange(10):
            self.process.terminate()
            logger.debug('Terminating task process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_type': self.type,
                'pid': self.process.pid,
            })
            time.sleep(1)
            if self.process.poll() is not None:
                break

        if self.process.poll() is None:
            for i in xrange(30):
                self.process.kill()
                logger.debug('Killing task process. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'task_type': self.type,
                    'pid': self.process.pid,
                })
                time.sleep(0.5)
                if self.process.poll() is not None:
                    break

        if self.process.poll() is None:
            logger.error('Failed to abort task process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_type': self.type,
                'pid': self.process.pid,
            })

        logger.warning('Task aborted. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
            'task_type': self.type,
        })

        self._pre_aborted()
        self.aborted()
        self._post_aborted()

    def _exec(self, args, env=None, shell=False):
        self.process = subprocess.Popen(args, env=env, shell=shell)
        return_code = None

        while True:
            poll = self.process.poll()
            if poll is not None:
                return_code = poll
                break
            if self.state == ABORTING:
                self._abort_process()
                return
            time.sleep(0.5)

        return return_code
