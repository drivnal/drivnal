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

class MoveVolume(Task):
    def __init__(self, *kargs, **kwargs):
        Task.__init__(self, *kargs, **kwargs)
        self.type = MOVE_VOLUME

    def _get_mount(self, path):
        output = subprocess.check_output(['df', '-P', path])
        return output.strip().split(' ')[-1]

    def _abort_process(self, process):
        for i in xrange(10):
            process.terminate()
            logger.debug('Terminating volume move process. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
                'pid': process.pid,
            })
            time.sleep(1)
            if process.poll() is not None:
                break

        if process.poll() is None:
            for i in xrange(30):
                process.kill()
                logger.debug('Killing volume move process. %r' % {
                    'volume_id': self.volume_id,
                    'task_id': self.id,
                    'pid': process.pid,
                })
                time.sleep(0.5)
                if process.poll() is not None:
                    break

        if process.poll() is None:
            logger.error('Failed to abort volume move process. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
                'pid': process.pid,
            })

        logger.warning('Volume move aborted. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })

        self.remove_snapshot()
        self.aborted()

    def run(self):
        source_path = self.volume.orig_path
        destination_path = self.volume.path

        if self._get_mount(source_path) == self._get_mount(destination_path):
            logger.info('Moving volume. %r' % {
                'volume_id': self.volume_id,
            })

            args = ['find', source_path, '-mindepth', '1', '-maxdepth', '1',
                '-exec', 'mv', '-t', destination_path, '--', '{}', ';']

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
                time.sleep(0.5)

        else:
            logger.info('Copying volume. %r' % {
                'volume_id': self.volume_id,
            })

            log_path = os.path.join(source_path, LOG_DIR,
                'copy_volume_%s.log' % int(time.time()))

            rsync_source_path = source_path
            if rsync_source_path[-1] != os.sep:
                rsync_source_path += os.sep

            rsync_destination_path = destination_path
            if rsync_destination_path[-1] != os.sep:
                rsync_destination_path += os.sep

            args = ['rsync', '--archive', '--hard-links', '--acls',
                '--quiet', '--xattrs',  '--progress', '--super',
                '--log-file-format=%o \"%f\" %l', '--log-file=%s' % log_path,
                rsync_source_path, rsync_destination_path]

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
                time.sleep(0.5)

            logger.debug('Removing previous copy of volume. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })

            for name in os.listdir(source_path):
                path = os.path.join(source_path, name)
                try:
                    if os.path.isfile(path):
                        os.remove(path)
                    else:
                        shutil.rmtree(path)
                except Exception:
                    logger.debug('Failed to delete path while removing ' +
                        'previous volume files. %r' % {
                            'volume_id': self.volume_id,
                            'task_id': self.id,
                        })

        if return_code != 0:
            raise OSError('Volume move failed, command ' + \
                'returned non-zero exit status. %r' % {
                    'volume_id': self.volume_id,
                    'task_id': self.id,
                })
        else:
            logger.debug('Volume move complete, committing config. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })
            self.volume.client.commit()

        Event(type=VOLUMES_UPDATED)
