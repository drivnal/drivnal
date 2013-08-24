from constants import *
from drivnal import server
from database_object import DatabaseObject
import logging
import time
import uuid

logger = logging.getLogger(APP_NAME)

class Event(DatabaseObject):
    column_family = 'events'
    str_columns = ['volume_id', 'type']
    int_columns = ['time']
    cached_columns = ['volume_id', 'type', 'time']
    required_columns = ['volume_id', 'type', 'time']

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

    @staticmethod
    def clean_database():
        cur_time = int(time.time() * 1000)

        events_query = server.app_db.get(Event.column_family)
        for event_id in events_query:
            event = events_query[event_id]

            # Skip broken events
            if not DatabaseObject.validate(Event, event_id, event):
                continue

            event['time'] = int(event['time'])

            # Remove events after ttl
            if (cur_time - event['time']) > EVENT_DB_TTL:
                logger.debug('Removing event past ttl from database. %r' % {
                    'event_id': event_id,
                })
                server.app_db.remove(Event.column_family, event_id)
                continue

    @staticmethod
    def get_events(volume, last_time):
        events = []
        events_dict = {}
        events_time = []
        cur_time = int(time.time() * 1000)

        logger.debug('Getting events for volume. %r' % {
            'volume_id': volume.id,
        })

        events_query = server.app_db.get(Event.column_family)
        for event_id in events_query:
            event = events_query[event_id]

            # Skip broken events
            if not DatabaseObject.validate(Event, event_id, event):
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
