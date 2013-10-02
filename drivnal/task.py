from constants import *
from event import Event
from database_object import DatabaseObject
import threading
import logging
import time
import uuid
import os

logger = logging.getLogger(APP_NAME)
_task_threads = {}

class Task(DatabaseObject):
    column_family = 'tasks'
    str_columns = ['volume_id', 'type', 'state', 'log_path']
    int_columns = ['time', 'snapshot_id']
    cached_columns = ['volume_id', 'type', 'time', 'snapshot_id']
    required_columns = ['volume_id', 'type', 'state', 'time']

    def __init__(self, id=None, volume=None, snapshot=None):
        DatabaseObject.__init__(self)

        if id is None:
            self.id = uuid.uuid4().hex
            # Transfer the class attribute to the database
            self.type = self.type
            self.state = None
            self.time = None
            self.volume_id = None
            _task_threads[self.id] = None

        else:
            self.id = id

        if volume is None:
            self.volume = None
        else:
            self.volume_id = volume.id
            self.volume = volume

        if snapshot is not None:
            self.snapshot_id = snapshot.id
            self.snapshot = snapshot

        self.update()

    def __getattr__(self, name):
        if name == 'thread':
            if self.id not in _task_threads:
                return None
            return _task_threads[self.id]
        else:
            return DatabaseObject.__getattr__(self, name)

    def __setattr__(self, name, value):
        if name == 'thread':
            if value is None:
                if self.id in _task_threads:
                    del _task_threads[self.id]
            else:
                _task_threads[self.id] = value
        else:
            DatabaseObject.__setattr__(self, name, value)

        if name == 'state' and value:
            Event(volume_id=self.volume_id, type=TASKS_UPDATED)

    def log_read(self):
        if not self.log_path:
            return
        try:
            with open(self.log_path) as file_data:
                return file_data.read()
        except OSError, error:
            logger.warning('Failed to read task log file. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
                'error': error,
            })
            return

    def log_size(self):
        if not self.log_path:
            return
        try:
            return os.path.getsize(self.log_path)
        except OSError, error:
            logger.warning('Failed to get task log file size. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
                'error': error,
            })
            return

    def abort(self):
        logger.debug('Aborting task. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })
        self.state = ABORTING
        Event(volume_id=self.volume_id, type=TASKS_UPDATED)

    def aborted(self):
        logger.debug('Task aborted. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })
        self.state = ABORTED
        self.thread = None
        Event(volume_id=self.volume_id, type=TASKS_UPDATED)

    def remove(self):
        logger.debug('Removing task. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })
        # Volume id will be removed in next call
        volume_id = self.volume_id
        self.db.remove(self.column_family, self.id)
        Event(volume_id=volume_id, type=TASKS_UPDATED)

    def run(self, *args, **kwargs):
        raise NotImplementedError('Derived class must override run method')

    def _run(self, *args, **kwargs):
        try:
            self.run(*args, **kwargs)
            if self.state == PENDING:
                self.state = COMPLETE
            elif self.state == ABORTING:
                self.state = ABORTED
            self.thread = None
        except:
            logger.exception('Task failed. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })
            self.state = FAILED
            self.thread = None
        finally:
            if self.state == PENDING:
                self.state = FAILED
                self.thread = None
            self.post_run()

    def post_run(self):
        pass

    def start(self, *args, **kwargs):
        self.volume_id = self.volume_id
        self.time = int(time.time())
        self.state = PENDING
        self.thread = threading.Thread(
            target=self._run, args=args, kwargs=kwargs)
        self.thread.start()

    def join(self):
        if not self.thread:
            return
        self.thread.join()

    def update(self):
        if self.state not in [PENDING, ABORTING]:
            return

        if not self.thread or not self.thread.is_alive():
            logger.warning('Task failed, thread ended unexpectable. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })
            self.state = FAILED

    @staticmethod
    def clean_database():
        tasks_dict = {}
        tasks_time = []

        tasks_query = Task.db.get(Task.column_family)
        for task_id in tasks_query:
            task = tasks_query[task_id]

            # Skip broken events
            if not DatabaseObject.validate(Task, task_id, task):
                continue

            task['time'] = int(task['time'])

            task_time_id = '%s-%s' % (task['time'], task_id)
            tasks_dict[task_time_id] = task_id
            tasks_time.append(task_time_id)

        prune_count = len(tasks_query) - TASK_DB_MAX
        if prune_count <= 0:
            return

        # Remove tasks after limit is reached
        tasks_time = sorted(tasks_time)
        for i in xrange(prune_count):
            task_id = tasks_dict[tasks_time.pop(0)]
            logger.debug('Max task count reached removing task ' + \
                    'from database. %r' % {
                'task_id': task_id,
            })
            Task.db.remove(Task.column_family, task_id)

    @staticmethod
    def _get_tasks(volume, type, states=[]):
        tasks = []
        tasks_dict = {}
        tasks_time = []

        logger.debug('Getting tasks for volume. %r' % {
            'volume_id': volume.id,
        })

        tasks_query = Task.db.get(Task.column_family)
        for task_id in tasks_query:
            task = tasks_query[task_id]

            # Skip broken events
            if not DatabaseObject.validate(Task, task_id, task):
                continue

            task['time'] = int(task['time'])
            if type and task['type'] != type:
                continue
            if task['volume_id'] != volume.id:
                continue
            if states and task['state'] not in states:
                continue
            if not states and not task['state']:
                continue

            # Task update occurs here recheck state
            task = Task(id=task_id)
            if states and task.state not in states:
                continue
            task_time_id = '%s-%s' % (task.time, task_id)
            tasks_dict[task_time_id] = task
            tasks_time.append(task_time_id)

        for task_time_id in sorted(tasks_time):
            tasks.append(tasks_dict[task_time_id])

        return tasks

    @staticmethod
    def get_task(task_id):
        logger.debug('Getting task. %r' % {
            'task_id': task_id,
        })

        task = Task.db.get(Task.column_family, task_id)
        if task:
            if DatabaseObject.validate(Task, task_id, task):
                return Task(id=task_id)

    @staticmethod
    def get_tasks(volume, type=None):
        return Task._get_tasks(volume, type)

    @staticmethod
    def get_failed_tasks(volume, type=None):
        return Task._get_tasks(volume, type, [FAILED])

    @staticmethod
    def get_aborted_tasks(volume, type=None):
        return Task._get_tasks(volume, type, [ABORTED])

    @staticmethod
    def get_pending_tasks(volume, type=None):
        # Valid pending tasks will always be in task_threads if
        # empty assume there are no pending tasks
        if not len(_task_threads):
            return []
        return Task._get_tasks(volume, type, [PENDING, ABORTING])

    @staticmethod
    def get_completed_tasks(volume, type=None):
        return Task._get_tasks(volume, type, [COMPLETE])
