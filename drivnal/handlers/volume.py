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
        'excludes': volume.excludes,
        'schedule': volume.schedule or 0,
        'min_free_space': volume.min_free_space or 0,
        'snapshot_limit': volume.snapshot_limit,
        'bandwidth_limit': volume.bandwidth_limit or 0,
        'snapshot_pending': volume.snapshot_pending(),
        'ignore_procs': volume.ignore_procs,
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

    if volume_id:
        volume = client.get_volume(volume_id)
    else:
        volume = client.add_volume(os.path.normpath(path))
        if volume.source_path:
            return utils.jsonify({})

    if 'name' in flask.request.json:
        volume.name = flask.request.json['name']
    if 'source_path' in flask.request.json:
        volume.source_path = os.path.normpath(
            flask.request.json['source_path'])
    if 'path' in flask.request.json:
        volume.path = os.path.normpath(flask.request.json['path'])
    if 'excludes' in flask.request.json:
        volume.excludes = flask.request.json['excludes']
        for i, exclude in enumerate(volume.excludes):
            volume.excludes[i] = os.path.normpath(exclude)

    if 'schedule' in flask.request.json:
        volume.schedule = flask.request.json['schedule']
    if 'min_free_space' in flask.request.json:
        volume.min_free_space = flask.request.json['min_free_space']
    if 'snapshot_limit' in flask.request.json:
        volume.snapshot_limit = flask.request.json['snapshot_limit']
    if 'bandwidth_limit' in flask.request.json:
        volume.bandwidth_limit = flask.request.json['bandwidth_limit']

    if 'email' in flask.request.json:
        volume.email = flask.request.json['email']
    if 'email_host' in flask.request.json:
        volume.email_host = flask.request.json['email_host']
    if 'email_user' in flask.request.json:
        volume.email_user = flask.request.json['email_user']
    if 'email_pass' in flask.request.json:
        volume.email_pass = flask.request.json['email_pass']
    if 'email_ssl' in flask.request.json:
        volume.email_ssl = flask.request.json['email_ssl']

    volume.commit()

    if 'email_send_test' in flask.request.json and \
            flask.request.json['email_send_test']:
        msg = Messenger(volume)
        msg.send('Test notification.')

    return utils.jsonify({})

@server.app.route('/volume/<volume_id>', methods=['DELETE'])
def volume_delete(volume_id):
    client = Client()
    client.remove_volume(volume_id)

    return utils.jsonify({})
