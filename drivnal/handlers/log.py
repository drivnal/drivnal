from drivnal.constants import *
from drivnal.client import Client
import drivnal.utils as utils
from drivnal import server

@server.app.route('/log/<type>/<volume_id>/<type_id>', methods=['GET'])
def log_get(type, volume_id, type_id):
    client = Client()
    volume = client.get_volume(volume_id)
    data = None

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    if type == 'snapshot':
        snapshot_id = type_id
        snapshot = volume.get_snapshot(int(snapshot_id))

        if not snapshot:
            return utils.jsonify({
                'error': SNAPSHOT_NOT_FOUND,
                'error_msg': SNAPSHOT_NOT_FOUND_MSG,
            }, 404)

        # Log files > 1mb load slow with syntax highlighter
        if snapshot.log_size() > 1048576:
            syntax = ''
        else:
            syntax = 'shell'

        data = {
            'id': snapshot.id,
            'syntax': syntax,
            'data': snapshot.log_read(),
        }

    elif type == 'task':
        task_id = type_id
        # TODO

    if not data:
        return utils.jsonify({
            'error': FILE_NOT_FOUND,
            'error_msg': FILE_NOT_FOUND_MSG,
        }, 404)

    return utils.jsonify(data)
