APP_NAME = 'drivnal'
APP_NAME_FORMATED = 'Drivnal'
CONF_FILENAME = '%s.conf' % APP_NAME

CLOSED = 'closed'
SAVED = 'saved'
UNSAVED = 'unsaved'

FAILED = 'failed'
REMOVING = 'removing'
ABORTED = 'aborted'
ABORTING = 'aborting'
PENDING = 'pending'
COMPLETE = 'complete'

CREATE_SNAPSHOT = 'create_snapshot'
REMOVE_SNAPSHOT = 'remove_snapshot'
RESTORE_OBJECT = 'restore_object'
MOVE_VOLUME = 'move_volume'

VOLUMES_UPDATED = 'volumes_updated'
SNAPSHOTS_UPDATED = 'snapshots_updated'
TASKS_UPDATED = 'tasks_updated'

SNAPSHOT_DIR = 'snapshots'
LOG_DIR = 'logs'

DEFAULT_MAX_PRUNE = 0.8
DEFAULT_MAX_RETRY = 3
DEFAULT_DB_PATH = '/var/lib/drivnal/drivnal.db'
DEFAULT_WWW_PATH = '/usr/share/drivnal/www'

DEFAULT_ROOT_EXCLUDES = [
    '/dev/*',
    '/proc/*',
    '/sys/*',
    '/tmp/*',
    '/run/*',
    '/mnt/*',
    '/media/*',
    '/lost+found',
]

DIR_MIME_TYPE = 'inode/directory'

MIN_UNITS = ['m', 'min', 'minute']
HOUR_UNITS = ['h', 'hr', 'hour']
DAY_UNITS = ['d', 'day']
WEEKDAY_UNITS = {
    'monday': 0,
    'mon': 0,
    'mo': 0,
    'm': 0,
    'tuesday': 1,
    'tues': 1,
    'tue': 1,
    'tu': 1,
    't': 1,
    'wednesday': 2,
    'wed': 2,
    'we': 2,
    'w': 2,
    'thursday': 3,
    'thur': 3,
    'thu': 3,
    'th': 3,
    'friday': 4,
    'fri': 4,
    'fr': 4,
    'f': 4,
    'saturday': 5,
    'sat': 5,
    'sa': 5,
    's': 5,
    'sunday': 6,
    'sun': 6,
    'su': 6,
}

VOLUME_NOT_FOUND = 'volume_not_found'
VOLUME_NOT_FOUND_MSG = 'Volume not found'

SNAPSHOT_NOT_FOUND = 'snapshot_not_found'
SNAPSHOT_NOT_FOUND_MSG = 'Snapshot not found'

PATH_NOT_FOUND = 'path_not_found'
