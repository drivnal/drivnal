from drivnal.constants import *
from drivnal.client import Client
from drivnal.task import Task
import drivnal.utils as utils
from drivnal import server
import time

@server.app.route('/snapshot/<volume_id>', methods=['GET'])
def snapshot_get(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

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
            'has_log': True,
        })

    return utils.jsonify(snapshots)

@server.app.route('/snapshot/<volume_id>', methods=['POST'])
def snapshot_post(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    snapshot_task = volume.create_snapshot()

    return utils.jsonify({})

@server.app.route('/snapshot/<volume_id>/<int:snapshot_id>',
    methods=['DELETE'])
def snapshot_delete(volume_id, snapshot_id):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    snapshot = volume.get_snapshot(snapshot_id)

    if not snapshot:
        return utils.jsonify({
            'error': SNAPSHOT_NOT_FOUND,
            'error_msg': SNAPSHOT_NOT_FOUND_MSG,
        }, 404)

    volume.remove_snapshot(snapshot)

    return utils.jsonify({})
