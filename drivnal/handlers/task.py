from drivnal.constants import *
from drivnal.backup import Client
from drivnal.backup import Task
import drivnal.utils as utils
from drivnal import server
import os
import flask
import time

@server.app.route('/task/<volume_id>', methods=['GET'])
def task_get(volume_id):
    client = Client()
    volume = client.get_volume(volume_id)
    tasks = []

    for task in reversed(volume.get_tasks()):
        tasks.append({
            'id': task.id,
            'volume': volume.id,
            'volume_name': volume.name,
            'type': task.type,
            'state': task.state,
            'time': task.time,
        })

    return utils.jsonify(tasks)

@server.app.route('/task/<volume_id>/<task_id>', methods=['PUT'])
def task_put(volume_id, task_id):
    client = Client()
    volume = client.get_volume(volume_id)
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
