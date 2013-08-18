from drivnal.constants import *
from drivnal.client import Client
import drivnal.utils as utils
from drivnal import server
import os
import flask

@server.app.route('/path', methods=['GET'])
@server.app.route('/path/<path:path>', methods=['GET'])
def path_get(path=None):
    path = '/' + (path or '')
    paths = []

    if path != '/':
        paths.append({
            'name': '..',
            'path': os.path.abspath(os.path.join(path, os.pardir)),
        })

    try:
        path_list = os.listdir(path)
    except OSError, error:
        return utils.jsonify({
            'error': PATH_NOT_FOUND,
            'error_msg': error.strerror,
        }, 404)

    for name in sorted(path_list):
        full_path = os.path.join(path, name)
        if not os.path.isdir(full_path):
            continue

        paths.append({
            'name': name,
            'path': full_path,
        })

    return utils.jsonify(paths)
