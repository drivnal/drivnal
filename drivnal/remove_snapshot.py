from constants import *
from task import Task
from event import Event
import os
import time
import shlex
import logging
import shutil
import subprocess

logger = logging.getLogger(APP_NAME)

class RemoveSnapshot(Task):
    def __init__(self, *kargs, **kwargs):
        Task.__init__(self, *kargs, **kwargs)
        self.type = REMOVE_SNAPSHOT

    def _abort_process(self, process):
        for i in xrange(10):
            process.terminate()
            logger.debug('Terminating snapshot remove process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
                'pid': process.pid,
            })
            time.sleep(1)
            if process.poll() is not None:
                break

        if process.poll() is None:
            for i in xrange(30):
                process.kill()
                logger.debug('Killing snapshot remove process. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'task_id': self.id,
                    'pid': process.pid,
                })
                time.sleep(0.5)
                if process.poll() is not None:
                    break

        if process.poll() is None:
            logger.error('Failed to abort snapshot remove process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
                'pid': process.pid,
            })

        logger.warning('Snapshot remove aborted. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
            'task_id': self.id,
        })

        self.aborted()

    def run(self, keep_log=False):
        if not keep_log:
            logger.debug('Removing snapshot log file. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })

            if os.path.isfile(self.snapshot.log_path):
                os.remove(self.snapshot.log_path)

        if not os.path.isdir(self.snapshot.path):
            return

        snapshot_path_temp = '%s.removing' % self.snapshot.path
        snapshot_path_failed = '%s.failed' % self.snapshot.path

        try:
            os.rename(self.snapshot.path, snapshot_path_temp)
        except OSError:
            logging.error('Snapshot remove failed, ' + \
                'unable to rename snapshot temp directory. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'task_id': self.id,
                })
            raise

        logger.debug('Removing snapshot directory. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
            'task_id': self.id,
        })

        args = ['rm', '-rf', snapshot_path_temp]

        process = subprocess.Popen(args)
        return_code = None

        while True:
            poll = process.poll()
            if poll is not None:
                return_code = poll
                break
            if self.state == ABORTING:
                # Attempt to set snapshot as failed
                try:
                    os.rename(snapshot_path_temp, snapshot_path_failed)
                except OSError:
                    pass

                self._abort_process(process)
                return
            time.sleep(0.5)

        time.sleep(5)

        Event(volume_id=self.volume_id, type=SNAPSHOTS_UPDATED)
