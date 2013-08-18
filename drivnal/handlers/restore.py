from drivnal.constants import *
from drivnal.client import Client
from drivnal.task import Task
from drivnal.object import Object
import drivnal.utils as utils
from drivnal import server
import flask
import time
import os

@server.app.route('/restore/<volume_id>/<int:snapshot_id>', methods=['POST'])
def restore_post(volume_id, snapshot_id):
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

    source_paths = flask.request.json['source_paths']
    destination_path = os.path.join(
        volume.source_path, flask.request.json['destination_path'])
    source_objects = []

    for path in source_paths:
        source_objects.append(Object(os.path.join(snapshot.path, path)))

    volume.restore_object(source_objects, destination_path)

    return utils.jsonify({})
