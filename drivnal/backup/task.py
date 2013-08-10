from drivnal.constants import *
from drivnal import server
from event import Event
import threading
import logging
import time
import uuid

logger = logging.getLogger(APP_NAME)
task_threads = {}

_STR_DATABASE_VARIABLES = ['volume_id', 'type', 'state']
_INT_DATABASE_VARIABLES = ['time']

class Task:
    def __init__(self, id=None, volume=None):
        if id is None:
            self.id = uuid.uuid1().hex
            self.type = None
            self.state = None
            self.time = None
            self.volume_id = None
            task_threads[self.id] = None
        else:
            self.id = id

        if volume is None:
            self.volume = None
        else:
            self.volume_id = volume.id
            self.volume = volume

    def __setattr__(self, name, value):
        if name == 'thread':
            task_threads[self.id] = value
        elif name in _STR_DATABASE_VARIABLES:
            server.app_db.set('tasks', self.id, name, value)
        elif name in _INT_DATABASE_VARIABLES:
            server.app_db.set('tasks', self.id, name, str(value))
        else:
            self.__dict__[name] = value

        if name == 'state' and value:
            Event(volume_id=self.volume_id, type=TASKS_UPDATED)

    def __getattr__(self, name):
        if name == 'thread':
            if self.id not in task_threads:
                return None
            return task_threads[self.id]
        elif name in _STR_DATABASE_VARIABLES:
            return server.app_db.get('tasks', self.id, name)
        elif name in _INT_DATABASE_VARIABLES:
            value = server.app_db.get('tasks', self.id, name)
            if value:
                return int(value)
            return None
        elif name not in self.__dict__:
            raise AttributeError('Object instance has no attribute %r' % name)
        return self.__dict__[name]

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
        server.app_db.remove('tasks', self.id)
        Event(volume_id=self.volume_id, type=TASKS_UPDATED)

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

    def start(self, *args, **kwargs):
        self.volume_id = self.volume_id
        self.time = int(time.time())
        self.state = PENDING
        self.thread = threading.Thread(
            target=self._run, args=args, kwargs=kwargs)
        self.thread.start()

    def update(self):
        if task.state not in [PENDING, ABORTING]:
            return

        logger.debug('Updating task state. %r' % {
            'volume_id': self.volume_id,
            'task_id': self.id,
        })

        if not self.thread.is_alive():
            logger.warning('Task failed, thread ended unexpectable. %r' % {
                'volume_id': self.volume_id,
                'task_id': self.id,
            })
            self.state = FAILED

    @staticmethod
    def _get_tasks(volume, type, states=[]):
        tasks = []
        tasks_dict = {}
        tasks_time = []

        logger.debug('Getting tasks for volume. %r' % {
            'volume_id': volume.id,
        })

        tasks_query = server.app_db.get('tasks')
        for task_id in tasks_query:
            task = tasks_query[task_id]
            task['time'] = int(task['time'])
            if type and task['type'] != type:
                continue
            if task['volume_id'] != volume.id:
                continue
            if states and task['state'] not in states:
                continue
            if not states and not task['state']:
                continue
            tasks_dict[task['time']] = Task(id=task_id)
            tasks_time.append(task['time'])

        for task_time in sorted(tasks_time):
            tasks.append(tasks_dict[task_time])

        return tasks

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
        return Task._get_tasks(volume, type, [PENDING, ABORTING])

    @staticmethod
    def get_completed_tasks(volume, type=None):
        return Task._get_tasks(volume, type, [COMPLETE])
