from constants import *
from drivnal import server
import logging
import time
import uuid

logger = logging.getLogger(APP_NAME)

_STR_DATABASE_VARIABLES = ['volume_id', 'type']
_INT_DATABASE_VARIABLES = ['time']

class Event:
    def __init__(self, id=None, volume_id=None, type=None):
        if id is None:
            self.id = uuid.uuid4().hex
            self.type = type
            self.time = int(time.time() * 1000)
            self.volume_id = None
        else:
            self.id = id

        if volume_id is not None:
            self.volume_id = volume_id

    def __setattr__(self, name, value):
        if name in _STR_DATABASE_VARIABLES:
            server.app_db.set('events', self.id, name, value)
        elif name in _INT_DATABASE_VARIABLES:
            server.app_db.set('events', self.id, name, str(value))
        else:
            self.__dict__[name] = value

    def __getattr__(self, name):
        if name in _STR_DATABASE_VARIABLES:
            return server.app_db.get('events', self.id, name)
        elif name in _INT_DATABASE_VARIABLES:
            value = server.app_db.get('events', self.id, name)
            if value:
                return int(value)
            return None
        elif name not in self.__dict__:
            raise AttributeError('Object instance has no attribute %r' % name)
        return self.__dict__[name]

    @staticmethod
    def _validate(data):
        if 'time' not in data or not data['time']:
            return False

        try:
            data_time = int(data['time'])
        except ValueError:
            return False

        if 'type' not in data or not data['type']:
            return False

        if 'volume_id' not in data:
            return False

        return True

    @staticmethod
    def get_events(volume, last_time):
        events = []
        events_dict = {}
        events_time = []

        logger.debug('Getting events for volume. %r' % {
            'volume_id': volume.id,
        })

        events_query = server.app_db.get('events')
        for event_id in events_query:
            event = events_query[event_id]

            # Remove broken events
            if not Event._validate(event):
                logger.debug('Removing broken event from database. %r' % {
                    'volume_id': volume.id,
                    'event_id': event_id,
                })
                server.app_db.remove('events', event_id)
                continue

            event['time'] = int(event['time'])

            if event['time'] <= last_time:
                continue

            if event['volume_id'] and event['volume_id'] != volume.id:
                continue

            # Prevent events with the same time from breaking sorted list,
            # event that is sent to client will always have original time
            while True:
                if event['time'] not in events_time:
                    break
                event['time'] += 1

            events_dict[event['time']] = Event(id=event_id)
            events_time.append(event['time'])

        for event_time in sorted(events_time):
            events.append(events_dict[event_time])

        return events
