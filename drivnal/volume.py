from constants import *
from exceptions import *
from config import Config
from origin import Origin
from snapshot import Snapshot
from task import Task
from event import Event
from create_snapshot import CreateSnapshot
from restore_object import RestoreObject
from move_volume import MoveVolume
import os
import time
import uuid
import shutil
import logging

logger = logging.getLogger(APP_NAME)

class Volume:
    def __init__(self, client, path):
        try:
            config_path = os.path.join(path, CONF_FILENAME)
        except AttributeError:
            logger.error('Failed to join volume config path. %r' % {
                'volume_id': self.id,
            })
            raise

        self.config = Config(config_path)
        self.client = client

        self.orig_path = path
        self.path = path

        if not self.id:
            self.id = uuid.uuid1().hex
            logger.debug('Generated and setting volume uuid. %r' % {
                'volume_id': self.id,
            })
            self.commit()

    def __getattr__(self, name):
        if name in ['id', 'name', 'source_path', 'excludes', 'schedule', \
                'min_free_space', 'bandwidth_limit', 'origin']:
            self.load()
        if name in ['snapshots']:
            self.load_snapshots()

        if name not in self.__dict__:
            raise AttributeError('Object instance has no attribute %r' % name)
        return self.__dict__[name]

    def get_snapshot(self, id):
        for snapshot in self.snapshots:
            if snapshot.id == id:
                return snapshot

    def get_failed_snapshots(self):
        snapshots = []
        for snapshot in self.snapshots:
            if snapshot.state == FAILED:
                snapshots.append(snapshot)
        return snapshots

    def get_snapshots(self):
        snapshots = []
        for snapshot in self.snapshots:
            if snapshot.state == COMPLETE:
                snapshots.append(snapshot)
        return snapshots

    def get_snapshot_count(self):
        count = 0
        for snapshot in self.snapshots:
            if snapshot.state == COMPLETE:
                count += 1
        return count

    def get_last_snapshot(self):
        for snapshot in reversed(self.snapshots):
            if snapshot.state == COMPLETE:
                return snapshot

    def create_snapshot(self):
        logger.debug('Creating snapshot. %r' % {
            'volume_id': self.id,
        })

        if not os.access(self.path, os.W_OK):
            raise SnapshotPermissionError('Snapshot failed, write access ' + \
                'denied to volume storage directory. %r' % {
                    'volume_id': self.id,
                })

        if self.snapshot_pending():
            raise SnapshotAlreadyRunning('Snapshot failed, ' + \
                'snapshot already running. %r' % {
                    'volume_id': self.id,
                })

        logger.debug('Starting snapshot task. %r' % {
            'volume_id': self.id,
        })

        task = CreateSnapshot(volume=self)
        task.start()

        return task

    def remove_snapshot(self, snapshot, keep_log=False):
        logger.info('Removing snapshot. %r' % {
            'volume_id': self.id,
            'snapshot_id': snapshot.id,
        })

        self.snapshots.index(snapshot)

        if not keep_log:
            logger.debug('Removing snapshot log file. %r' % {
                'volume_id': self.id,
                'snapshot_id': snapshot.id,
            })

            if os.path.isfile(snapshot.log_path):
                os.remove(snapshot.log_path)

        logger.debug('Removing snapshot directory. %r' % {
            'volume_id': self.id,
            'snapshot_id': snapshot.id,
        })

        if os.path.isdir(snapshot.path):
            shutil.rmtree(snapshot.path)

        self.snapshots.remove(snapshot)
        Event(volume_id=self.id, type=SNAPSHOTS_UPDATED)

    def snapshot_pending(self):
        tasks = Task.get_pending_tasks(self, CREATE_SNAPSHOT)
        if tasks:
            return True
        return False

    def get_space_free(self):
        stat = os.statvfs(self.path)
        return float(stat.f_bavail) / stat.f_blocks

    def get_space_used(self):
        return 1 - self.get_space_free()

    def get_tasks(self):
        return Task.get_tasks(self)

    def get_events(self, last_time):
        return Event.get_events(self, last_time)

    def restore_object(self, objects, destination_path):
        logger.debug('Starting restore object task. %r' % {
            'volume_id': self.id,
        })

        task = RestoreObject(volume=self)
        task.start(objects, destination_path)

        return task

    def load(self):
        logger.debug('Reading volume config.')

        try:
            self.config.read()
        except IOError:
            pass

        self.id = self.config.id
        self.name = self.config.name
        self.source_path = self.config.source_path
        if self.source_path:
            try:
                self.source_path = os.path.normpath(self.source_path)
            except AttributeError:
                logger.error('Failed to normalize volume source path. %r' % {
                    'volume_id': self.id,
                })
        self.excludes = self.config.excludes or []
        for i, exclude in enumerate(self.excludes):
            try:
                self.excludes[i] = os.path.normpath(exclude)
            except AttributeError:
                logger.error('Failed to normalize volume exclude path. %r' % {
                    'volume_id': self.id,
                    'exclude_num': i,
                })
        self.schedule = self.config.schedule

        min_free_space = None
        if self.config.min_free_space:
            try:
                min_free_space = float(self.config.min_free_space)
            except ValueError:
                logger.warning(
                    'Config option min_free_space is invalid. %r' % {
                        'volume_id': self.id,
                    })
        self.min_free_space = min_free_space

        bandwidth_limit = None
        if self.config.bandwidth_limit:
            try:
                bandwidth_limit = int(self.config.bandwidth_limit)
            except ValueError:
                logger.warning(
                    'Config option bandwidth_limit is invalid. %r' % {
                        'volume_id': self.id,
                    })
        self.bandwidth_limit = bandwidth_limit

        max_prune = None
        if self.config.max_prune:
            try:
                max_prune = float(self.config.max_prune)
            except ValueError:
                logger.warning('Config option max_prune is invalid. %r' % {
                    'volume_id': self.id,
                })
        self.max_prune = max_prune

        max_retry = None
        if self.config.max_retry:
            try:
                max_retry = int(self.config.max_retry)
            except ValueError:
                logger.warning('Config option max_retry is invalid. %r' % {
                    'volume_id': self.id,
                })
        self.max_retry = max_retry

        self.origin = Origin(self)

    def load_snapshots(self):
        logger.debug('Loading snapshots. %r' % {
            'volume_id': self.id,
        })

        snapshot_names = []
        self.snapshots = []
        for name in os.listdir(self.path):
            if not os.path.isdir(os.path.join(self.path, name)) or \
                    not name.replace('.temp', '').replace(
                        '.failed', '').isdigit() or len(name) < 6:
                continue
            snapshot_names.append(name)

        for name in sorted(snapshot_names):
            self.snapshots.append(Snapshot(self, name))

    def _move_volume(self):
        logger.debug('Starting move volume task. %r' % {
            'volume_id': self.id,
        })

        task = MoveVolume(volume=self)
        task.start()

        return task

    def commit(self):
        retry_config_commit = False

        logger.debug('Writing volume config. %r' % {
            'volume_id': self.id,
        })

        self.config.id = self.id
        self.config.name = self.name
        self.config.source_path = self.source_path
        self.config.excludes = self.excludes
        self.config.schedule = self.schedule
        self.config.min_free_space = self.min_free_space
        self.config.bandwidth_limit = self.bandwidth_limit
        self.config.max_prune = self.max_prune
        self.config.max_retry = self.max_retry
        try:
            self.config.write()
        except:
            # If volume has already been moved write will need
            # to be done after move
            if self.orig_path != self.path:
                logger.debug('Failed to commit config to original ' + \
                    'volume path in a volume move, retying to new path ' +
                    'after volume is moved. %r' % {
                        'volume_id': self.id,
                    })
                retry_config_commit = True
            else:
                raise

        if self.orig_path != self.path:
            self._move_volume()

            if retry_config_commit:
                self.config.set_path(self.path)
                self.config.write()
