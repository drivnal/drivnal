from drivnal.constants import *
from drivnal.client import Client
import drivnal.utils as utils
from drivnal import server
import flask
import os

def _get_volume_object(volume):
    return {
        'id': volume.id,
        'name': volume.name or 'Backup Volume',
        'path': volume.path,
        'source_path': volume.source_path,
        'percent_used': volume.get_space_used(),
        'excludes': volume.excludes,
        'schedule': volume.schedule or 0,
        'min_free_space': volume.min_free_space or 0,
        'bandwidth_limit': volume.bandwidth_limit or 0,
        'snapshot_pending': volume.snapshot_pending()
    }

@server.app.route('/volume', methods=['GET'])
@server.app.route('/volume/<volume_id>', methods=['GET'])
def volume_get(volume_id=None):
    client = Client()

    if volume_id:
        volume = client.get_volume(volume_id)
        return utils.jsonify(_get_volume_object(volume))

    volumes = []
    for volume in client.volumes:
        volumes.append(_get_volume_object(volume))

    return utils.jsonify(volumes)

@server.app.route('/volume', methods=['POST'])
@server.app.route('/volume/<volume_id>', methods=['PUT', 'POST'])
def volume_put_post(volume_id=None):
    client = Client()

    name = flask.request.json['name'].encode()
    source_path = flask.request.json['source_path'].encode()
    path = flask.request.json['path'].encode()
    excludes = flask.request.json['excludes']
    schedule = flask.request.json['schedule']
    min_free_space = flask.request.json['min_free_space']
    bandwidth_limit = flask.request.json['bandwidth_limit']

    if volume_id:
        volume = client.get_volume(volume_id)
    else:
        volume = client.create_volume(os.path.normpath(path))
        if volume.source_path:
            return utils.jsonify({})

    volume.name = name
    volume.source_path = os.path.normpath(source_path)
    volume.path = os.path.normpath(path)
    volume.excludes = excludes
    for i, exclude in enumerate(volume.excludes):
        volume.excludes[i] = os.path.normpath(exclude)
    volume.schedule = schedule
    volume.min_free_space = min_free_space
    volume.bandwidth_limit = bandwidth_limit

    volume.commit()

    return utils.jsonify({})

@server.app.route('/volume/<volume_id>', methods=['DELETE'])
def volume_delete(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)

    client.remove_volume(volume)

    return utils.jsonify({})
