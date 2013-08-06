from drivnal.constants import *
from drivnal.backup import Client, Task
from drivnal import server
import drivnal.utils as utils
import time

@server.app.route('/snapshot/<volume_id>', methods=['GET'])
def snapshot_get(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)

    snapshots = []
    for snapshot in reversed(volume.get_snapshots()):
        snapshots.append({
            'id': snapshot.id,
            'volume': volume.id,
            'state': snapshot.state,
            'sent': snapshot.sent,
            'received': snapshot.received,
            'speed': snapshot.speed,
            'runtime': snapshot.runtime,
        })

    return utils.jsonify(snapshots)

@server.app.route('/snapshot/<volume_id>', methods=['POST'])
def snapshot_post(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)
    snapshot_task = volume.create_snapshot()

    return utils.jsonify({})

@server.app.route('/snapshot/<volume_id>/<int:snapshot_id>', methods=['DELETE'])
def snapshot_delete(volume_id, snapshot_id):
    client = Client()
    volume = client.get_volume(volume_id)
    snapshot = volume.get_snapshot(snapshot_id)

    volume.remove_snapshot(snapshot)

    return utils.jsonify({})
