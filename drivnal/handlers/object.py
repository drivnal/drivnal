from drivnal.constants import *
from drivnal.client import Client
import drivnal.utils as utils
from drivnal import server
import flask

@server.app.route('/object/<volume_id>/<snapshot_id>', methods=['GET'])
@server.app.route('/object/<volume_id>/<snapshot_id>/<path:path>',
    methods=['GET'])
def object_get(volume_id, snapshot_id, path=None):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    if snapshot_id == 'origin':
        bucket = volume.get_origin()
    else:
        bucket = volume.get_snapshot(int(snapshot_id))

    if not bucket:
        return utils.jsonify({
            'error': SNAPSHOT_NOT_FOUND,
            'error_msg': SNAPSHOT_NOT_FOUND_MSG,
        }, 404)

    objects_dict = {}
    objects_name = []

    try:
        bucket_objects = bucket.get_objects(path)
    except OSError, error:
        return utils.jsonify({
            'error': PATH_NOT_FOUND,
            'error_msg': error.strerror,
        }, 404)

    for object in bucket_objects:
        objects_dict[object.name] = {
            'id': object.name,
            'type': object.type,
            'syntax': object.syntax,
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
