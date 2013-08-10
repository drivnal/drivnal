from drivnal.constants import *
from drivnal.exceptions import *
from task import Task
import time
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class RestoreObject(Task):
    def __init__(self, *kargs, **kwargs):
        Task.__init__(self, *kargs, **kwargs)
        self.type = RESTORE_OBJECT

    def _abort_process(self, process):
        for i in xrange(10):
            process.terminate()
            logger.debug('Terminating restore process. %r' % {
                'volume_id': self.volume_id,
                'pid': process.pid,
            })
            time.sleep(1)
            if process.poll() is not None:
                break

        if process.poll() is None:
            for i in xrange(30):
                process.kill()
                logger.debug('Killing restore process. %r' % {
                    'volume_id': self.volume_id,
                    'pid': process.pid,
                })
                time.sleep(0.5)
                if process.poll() is not None:
                    break

        if process.poll() is None:
            logger.error('Failed to abort restore process. %r' % {
                'volume_id': self.volume_id,
                'pid': process.pid,
            })

        self.aborted()

    def run(self, objects, destination_path):
        logger.info('Restoring objects. %r' % {
            'volume_id': self.volume_id,
        })

        for obj in objects:
            args = ['rsync', '--archive', '--hard-links', '--acls',
                '--quiet', '--xattrs',  '--progress', '--super',
                obj.path, destination_path]

            process = subprocess.Popen(args)
            return_code = None

            while True:
                poll = process.poll()
                if poll is not None:
                    return_code = poll
                    break
                if self.state == ABORTING:
                    self._abort_process(process)
                    return
                time.sleep(0.1)

            if return_code != 0:
                raise RestoreSyncError('Object restore failed, command ' + \
                    'returned non-zero exit status. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': snapshot_id,
                    })
