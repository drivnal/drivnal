from constants import *
from exec_task import ExecTask
from event import Event
from drivnal import server
import os
import time
import shlex
import logging
import shutil
import subprocess

logger = logging.getLogger(APP_NAME)

class MoveVolume(ExecTask):
    type = MOVE_VOLUME

    def run(self):
        source_path = self.volume.orig_path
        destination_path = self.volume.path
        move_available = self.volume._move_available(source_path,
            destination_path)
        copy_available = self.volume._copy_available(source_path, destination_path)

        if not move_available and not copy_available:
            raise OSError('Unable to move volume to specified ' + \
                'location. %r' % {
                    'volume_id': self.volume_id,
                    'task_id': self.id,
                    'source_path': source_path,
                    'destination_path': destination_path,
                })

        logger.debug('Updating client config with volume path. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })
        server.app_db.set('system', 'volumes', self.volume.path, None)

        if move_available:
            logger.info('Moving volume. %r' % {
                'volume_id': self.volume_id,
            })

            source_path += os.sep + '*'

            # String required for bash to expand /*
            args = 'mv %s %s' % (source_path, destination_path)

            return_code = self._exec(args, shell=True)
            if return_code is None:
                return

        else:
            logger.info('Copying volume. %r' % {
                'volume_id': self.volume_id,
            })
            log_path = os.path.join(self.volume.log_dir,
                'copy_volume_%s.log' % int(time.time()))

            rsync_source_path = source_path
            if rsync_source_path[-1] != os.sep:
                rsync_source_path += os.sep

            rsync_destination_path = destination_path
            if rsync_destination_path[-1] != os.sep:
                rsync_destination_path += os.sep

            args = ['rsync', '--archive', '--hard-links', '--acls',
                '--quiet', '--xattrs',  '--progress', '--stats', '--super',
                '--log-file-format=%o \"%f\" %l', '--log-file=%s' % log_path,
                rsync_source_path, rsync_destination_path]

            return_code = self._exec(args)
            if return_code is None:
                return

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
            raise OSError('Volume move failed, command returned ' + \
                'non-zero exit status. Updating client config. %r' % {
                    'volume_id': self.volume_id,
                    'task_id': self.id,
                })
            server.app_db.remove('system', 'volumes', self.volume.path)
        else:
            logger.debug('Volume move complete, updating client config. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })
            server.app_db.remove('system', 'volumes', self.volume.orig_path)

        Event(type=VOLUMES_UPDATED)
