from constants import *
from exceptions import *
from config import Config
from origin import Origin
from task import Task
from event import Event
from core_snapshot import CoreSnapshot
from create_snapshot import CreateSnapshot
from remove_snapshot import RemoveSnapshot
from restore_object import RestoreObject
from move_volume import MoveVolume
import os
import time
import uuid
import logging

logger = logging.getLogger(APP_NAME)

class CoreVolume(Config):
    bool_options = ['email_ssl']
    int_options = ['snapshot_limit', 'bandwidth_limit']
    float_options = ['min_free_space', 'max_prune']
    path_options = ['excludes', 'source_path']
    str_options = ['id', 'name', 'schedule', 'email', 'email_host',
        'email_user', 'email_pass']
    list_options = ['excludes']
    SnapshotClass = CoreSnapshot

    def __init__(self, client, path, create=False):
        try:
            config_path = os.path.join(path, CONF_FILENAME)
        except AttributeError:
            logger.error('Failed to join volume config path. %r' % {
                'volume_id': self.id,
            })
            raise
        Config.__init__(self, config_path)

        self.client = client
        self.orig_path = path
        self.orig_source_path = self.source_path
        self.path = path

        if not self.id:
            if create:
                self.id = uuid.uuid4().hex
                logger.debug('Setting new volume uuid. %r' % {
                    'volume_id': self.id,
                })
                self.commit()
            else:
                raise IOError('Volume doesnt exists')

    def __getattr__(self, name):
        if name == '_snapshot_names':
            self.load_snapshots()
        elif name == 'log_dir':
            return self._get_log_dir()
        return Config.__getattr__(self, name)

    def get_origin(self):
        return Origin(self)

    def get_snapshot(self, id):
        for name in self._snapshot_names:
            snapshot = self.SnapshotClass(self, name)
            if snapshot.id == id:
                return snapshot

    def get_failed_snapshots(self):
        snapshots = []
        for name in self._snapshot_names:
            snapshot = self.SnapshotClass(self, name)
            if snapshot.state == FAILED:
                snapshots.append(snapshot)
        return snapshots

    def get_snapshots(self):
        snapshots = []
        for name in self._snapshot_names:
            snapshot = self.SnapshotClass(self, name)
            if snapshot.state in [REMOVING, WARNING, COMPLETE]:
                snapshots.append(snapshot)
        return snapshots

    def get_snapshot_count(self):
        count = 0
        for name in self._snapshot_names:
            snapshot = self.SnapshotClass(self, name)
            if snapshot.state == COMPLETE:
                count += 1
        return count

    def get_last_snapshot(self):
        for name in reversed(self._snapshot_names):
            snapshot = self.SnapshotClass(self, name)
            if snapshot.state in [WARNING, COMPLETE]:
                return snapshot

    def create_snapshot(self):
        logger.debug('Creating snapshot. %r' % {
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

    def remove_snapshot(self, snapshot, keep_log=False, block=False):
        task = RemoveSnapshot(volume=self, snapshot=snapshot)
        task.start(keep_log)

        if block:
            task.join()

        return task

    def snapshot_pending(self):
        tasks = Task.get_pending_tasks(self, CREATE_SNAPSHOT)
        if tasks:
            return True
        return False

    def get_space_used(self):
        return 1 - self.get_space_free()

    def get_task(self, task_id):
        return Task.get_task(task_id)

    def get_tasks(self):
        return Task.get_tasks(self)

    def restore_object(self, objects, destination_path):
        logger.debug('Starting restore object task. %r' % {
            'volume_id': self.id,
        })

        task = RestoreObject(volume=self)
        task.start(objects, destination_path)

        return task

    def load(self):
        try:
            Config.load(self)
        except IOError:
            # Config doesnt exists defaults will be used
            pass

    def load_snapshots(self):
        logger.debug('Loading snapshots. %r' % {
            'volume_id': self.id,
        })

        snapshot_names = []

        for name in self.list_path(SNAPSHOT_DIR, files=False):
            if not name[:8].isdigit() or len(name) < 6:
                continue
            snapshot_names.append(name)
        self._snapshot_names = sorted(snapshot_names)

    def _move_volume(self):
        logger.debug('Starting move volume task. %r' % {
            'volume_id': self.id,
        })

        task = MoveVolume(volume=self)
        task.start()

        return task

    def commit(self):
        Config.commit(self)
        Event(type=VOLUMES_UPDATED)

        if self.orig_path != self.path:
            self._move_volume()

    def _get_log_dir(self):
        return './'

    def _get_auto_excludes(self):
        pass

    def _move_available(self, source_path, destination_path):
        return True

    def _copy_available(self, source_path, destination_path):
        return True

    def get_space_free(self):
        return 1

    def list_path(self, path, files=True, dirs=True):
        return []
