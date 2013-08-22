import drivnal.utils as utils
from drivnal import server

@server.app.route('/debug/clear_events', methods=['GET'])
def debug_clear_events_get():
    server.app_db.remove('events')
    return 'events_cleared'

@server.app.route('/debug/clear_tasks', methods=['GET'])
def debug_clear_tasks_get():
    server.app_db.remove('tasks')
    return 'tasks_cleared'

@server.app.route('/debug/clear_volumes', methods=['GET'])
def debug_clear_volumes_get():
    server.app_db.remove('system', 'volumes')
    return 'volumes_cleared'

@server.app.route('/debug/dump_system', methods=['GET'])
def debug_dump_system_get():
    return utils.jsonify(server.app_db.get('system'))

@server.app.route('/debug/dump_events', methods=['GET'])
def debug_dump_events_get():
    return utils.jsonify(server.app_db.get('events'))

@server.app.route('/debug/dump_tasks', methods=['GET'])
def debug_dump_tasks_get():
    return utils.jsonify(server.app_db.get('tasks'))
