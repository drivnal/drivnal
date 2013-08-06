from drivnal.constants import *
from drivnal.backup import Client, Task, Object
from drivnal import server
import drivnal.utils as utils
import flask
import time
import os

@server.app.route('/restore/<volume_id>/<int:snapshot_id>', methods=['POST'])
def restore_post(volume_id, snapshot_id):
    client = Client()
    volume = client.get_volume(volume_id)
    snapshot = volume.get_snapshot(snapshot_id)
    source_paths = flask.request.json['source_paths']
    destination_path = os.path.join(
        volume.source_path, flask.request.json['destination_path'])
    source_objects = []

    for path in source_paths:
        source_objects.append(Object(os.path.join(snapshot.path, path)))

    volume.restore_object(source_objects, destination_path)

    return utils.jsonify({})
