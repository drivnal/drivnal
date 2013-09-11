from drivnal.constants import *
from drivnal.client import Client
from drivnal.task import Task
from drivnal.event import Event
import drivnal.utils as utils
from drivnal import server
import os
import flask
import time

@server.app.route('/task/<volume_id>', methods=['GET'])
def task_get(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    tasks = []

    for task in reversed(volume.get_tasks()):
        task_data = {
            'id': task.id,
            'volume': volume.id,
            'volume_name': volume.name,
            'type': task.type,
            'state': task.state,
            'time': task.time,
            'has_log': False,
        }

        if task.log_path:
            if os.path.isfile(task.log_path):
                task_data['has_log'] = True

        if task.snapshot_id:
            task_data['snapshot_id'] = task.snapshot_id

        tasks.append(task_data)

    return utils.jsonify(tasks)

@server.app.route('/task/<volume_id>/<task_id>', methods=['PUT'])
def task_put(volume_id, task_id):
    client = Client()
    volume = client.get_volume(volume_id)

    if not volume:
        return utils.jsonify({
            'error': VOLUME_NOT_FOUND,
            'error_msg': VOLUME_NOT_FOUND_MSG,
        }, 404)

    task = Task(id=task_id.encode())

    if 'abort' in flask.request.json and flask.request.json['abort']:
        task.abort()

    return utils.jsonify({})

@server.app.route('/task/<volume_id>/<task_id>', methods=['DELETE'])
def task_delete(volume_id, task_id):
    client = Client()
    task = Task(id=task_id.encode())
    task.remove()

    return utils.jsonify({})
