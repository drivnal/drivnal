from drivnal.constants import *
from drivnal.backup import Client
from drivnal import server
import drivnal.utils as utils
import flask

@server.app.route('/object/<volume_id>/<snapshot_id>', methods=['GET'])
@server.app.route('/object/<volume_id>/<snapshot_id>/<path:path>', methods=['GET'])
def object_get(volume_id, snapshot_id, path=None):
    client = Client()
    volume = client.get_volume(volume_id)

    if snapshot_id == 'origin':
        bucket = volume.origin
    else:
        bucket = volume.get_snapshot(int(snapshot_id))

    objects_dict = {}
    objects_name = []
    for object in bucket.get_objects(path):
        objects_dict[object.name] = {
            'id': object.name,
            'type': object.type,
            'size': object.size,
            'time': object.time,
        }
        objects_name.append(object.name)

    objects = []
    for object_name in sorted(objects_name):
        object = objects_dict[object_name]
        if object['type'] == DIR_MIME_TYPE:
            objects.append(object)

    for object_name in sorted(objects_name):
        object = objects_dict[object_name]
        if object['type'] != DIR_MIME_TYPE:
            objects.append(object)

    return utils.jsonify(objects)
