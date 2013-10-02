from drivnal.constants import *
from drivnal.client import Client
from drivnal.event import Event
import drivnal.utils as utils
from drivnal import server
import time
import uuid
import flask

@server.app.route('/event', methods=['GET'])
@server.app.route('/event/<int:last_event>', methods=['GET'])
def event_get(last_event=None):
    if server.interrupt:
        return flask.abort(503)

    if not last_event:
        events = [
            {
                'id': uuid.uuid4().hex,
                'type': 'time',
                'time': int(time.time() * 1000),
            },
        ]
        return utils.jsonify(events)

    run_time = 0
    while run_time <= 30 and not server.interrupt:
        events = []

        for event in Event.get_events(last_event):
            event_data = {
                'id': event.id,
                'type': event.type,
                'time': event.time,
            }
            if event.volume_id:
                event_data['volume_id'] = event.volume_id
            events.append(event_data)

        if len(events):
            return utils.jsonify(events)

        run_time += 0.1
        time.sleep(0.1)

    return utils.jsonify([])
