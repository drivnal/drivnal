from drivnal.constants import *
from drivnal.client import Client
import drivnal.utils as utils
from drivnal import server

@server.app.route('/text/<volume_id>/<snapshot_id>/<path:path>',
    methods=['GET'])
def text_get(volume_id, snapshot_id, path=None):
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

    object = bucket.get_object(path)
    object.get_syntax()

    syntax = object.syntax
    if object.syntax and object.size > MAX_TEXT_SIZE:
        syntax = ''

    object_data = {
        'id': object.name,
        'type': object.type,
        'syntax': syntax,
        'data': object.read(),
    }

    if not object_data:
        return utils.jsonify({
            'error': FILE_NOT_FOUND,
            'error_msg': FILE_NOT_FOUND_MSG,
        }, 404)

    return utils.jsonify(object_data)
