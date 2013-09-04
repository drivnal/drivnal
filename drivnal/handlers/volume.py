from drivnal.constants import *
from drivnal.client import Client
from drivnal.messenger import Messenger
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
        'excludes': volume.excludes or [],
        'schedule': volume.schedule or 0,
        'min_free_space': volume.min_free_space or 0,
        'snapshot_limit': volume.snapshot_limit,
        'bandwidth_limit': volume.bandwidth_limit or 0,
        'snapshot_pending': volume.snapshot_pending(),
        'email': volume.email,
        'email_host': volume.email_host,
        'email_user': volume.email_user,
        'email_pass': volume.email_pass,
        'email_ssl': volume.email_ssl,
    }

@server.app.route('/volume', methods=['GET'])
@server.app.route('/volume/<volume_id>', methods=['GET'])
def volume_get(volume_id=None):
    client = Client()

    if volume_id:
        volume = client.get_volume(volume_id)
        return utils.jsonify(_get_volume_object(volume))

    volumes = []
    for volume in client.get_volumes():
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
    snapshot_limit = flask.request.json['snapshot_limit']
    bandwidth_limit = flask.request.json['bandwidth_limit']
    email = flask.request.json['email']
    email_host = flask.request.json['email_host']
    email_user = flask.request.json['email_user']
    email_pass = flask.request.json['email_pass']
    email_ssl = flask.request.json['email_ssl']
    email_send_test = flask.request.json['email_send_test']

    if volume_id:
        volume = client.get_volume(volume_id)
    else:
        volume = client.add_volume(os.path.normpath(path))
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
    volume.snapshot_limit = snapshot_limit
    volume.bandwidth_limit = bandwidth_limit

    volume.email = email
    volume.email_host = email_host
    volume.email_user = email_user
    volume.email_pass = email_pass
    volume.email_ssl = email_ssl

    volume.commit()

    if email_send_test:
        msg = Messenger(volume)
        msg.send('Test notification.')

    return utils.jsonify({})

@server.app.route('/volume/<volume_id>', methods=['DELETE'])
def volume_delete(volume_id):
    client = Client()
    client.remove_volume(volume_id)

    return utils.jsonify({})
