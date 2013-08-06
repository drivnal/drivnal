from drivnal.constants import *
from drivnal.backup import Client
from drivnal import server
import drivnal.utils as utils
import time
import uuid

@server.app.route('/event/<volume_id>/<int:last_event>', methods=['GET'])
def event_get(volume_id, last_event):
    client = Client()
    volume = client.get_volume(volume_id)

    if not last_event:
        events = [
            {
                'id': uuid.uuid1().hex,
                'type': 'time',
                'time': int(time.time() * 1000),
            },
        ]
        return utils.jsonify(events)

    for i in xrange(int(5 / 0.3)):
        events = []

        for event in volume.get_events(last_event):
            events.append({
                'id': event.id,
                'type': event.type,
                'time': event.time,
                'volume_id': event.volume_id,
            })

        if len(events):
            return utils.jsonify(events)

        time.sleep(0.3)

    return utils.jsonify([])
