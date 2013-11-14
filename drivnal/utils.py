import flask
import json

def format_bytes(bytes):
    bytes = float(bytes.replace(',', ''))
    if bytes < 1024:
        return '%.2f bytes' % bytes
    elif bytes < 1048576:
        return '%.2f kB' % (bytes / 1024)
    elif bytes < 1073741824:
        return '%.2f MB' % (bytes / 1048576)
    elif bytes < 1099511627776:
        return '%.2f GB' % (bytes / 1073741824)
    else:
        return '%.2f TB' % (bytes / 1099511627776)

def format_seconds(seconds):
    seconds = float(seconds)
    if seconds < 60:
        return str(int(seconds)) + ' Seconds'
    elif seconds < 3600:
        return '%.1f Minutes' % (seconds / 60)
    elif seconds < 86400:
        return '%.1f Hours' % (seconds / 3600)
    else:
        return '%.1f Days' % (seconds / 86400)

def jsonify(data=None, status_code=None):
    if not isinstance(data, basestring):
        data = json.dumps(data)

    callback = flask.request.args.get('callback', False)
    if callback:
        data = '%s(%s)' % (callback, data)
        mimetype = 'application/javascript'
    else:
        mimetype = 'application/json'

    response = flask.Response(response=data, mimetype=mimetype)

    if status_code is not None:
        response.status_code = status_code

    return response
