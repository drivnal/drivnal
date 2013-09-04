from drivnal.constants import *
from drivnal.client import Client
from drivnal.event import Event
import drivnal.utils as utils
from drivnal import server
import time
import uuid

@server.app.route('/event', methods=['GET'])
@server.app.route('/event/<int:last_event>', methods=['GET'])
@server.app.route('/event/<volume_id>', methods=['GET'])
@server.app.route('/event/<volume_id>/<int:last_event>', methods=['GET'])
def event_get(volume_id=None, last_event=None):
    client = Client()
    volume = client.get_volume(volume_id)

    if not last_event:
        events = [
            {
                'id': uuid.uuid4().hex,
                'type': 'time',
                'time': int(time.time() * 1000),
            },
        ]
        return utils.jsonify(events)

    for i in xrange(int(10 / 0.5)):
        events = []

        for event in Event.get_events(volume, last_event):
            events.append({
                'id': event.id,
                'type': event.type,
                'time': event.time,
                'volume_id': event.volume_id,
            })

        if len(events):
            return utils.jsonify(events)

        time.sleep(0.5)

    return utils.jsonify([])
