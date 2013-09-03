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
WARNING = 'warning'
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

EVENT_DB_TTL = 61000
TASK_DB_MAX = 100

SMTP_TIMEOUT = 30
SMTP_FROM_ADDR = 'notify@drivnal.com'
SMTP_SUBJECT = 'Drivnal Notification'

MATCH_ALL = 'match_all'
MATCH_BOTH = 'match_both'
MATCH_PREFIX = 'match_prefix'
MATCH_SUFFIX = 'match_suffix'

DEFAULT_MAX_PRUNE = 0.8
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

RSYNC_WARN_EXIT_CODES = [
    23, # Partial transfer from error
    24, # Partial transfer from vanished files
]

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

EXTENSION_TYPES = {
    'scpt': 'applescript',
    'applescript': 'applescript',
    'as': 'actionscript3',
    'sh': 'shell',
    'cfm': 'coldfusion',
    'cfml': 'coldfusion',
    'cfc': 'coldfusion',
    'h': 'cpp',
    'hh': 'cpp',
    'hpp': 'cpp',
    'hxx': 'cpp',
    'h++': 'cpp',
    'c': 'c',
    'cc': 'cpp',
    'cpp': 'cpp',
    'cxx': 'cpp',
    'c++': 'cpp',
    'cs': 'csharp',
    'css': 'css',
    'less': 'css',
    'dfm': 'delphi',
    'delphi': 'delphi',
    'pp': 'pascal',
    'pas': 'pascal',
    'pascal': 'pascal',
    'diff': 'diff',
    'patch': 'patch',
    'erl': 'erlang',
    'hrl': 'erlang',
    'gy': 'groovy',
    'gvy': 'groovy',
    'gsh': 'groovy',
    'groovy': 'groovy',
    'hx': 'haxe',
    'hxml': 'haxe',
    'java': 'java',
    'class': 'java',
    'jfx': 'javafx',
    'javafx': 'javafx',
    'js': 'javascript',
    'json': 'javascript',
    'pl': 'perl',
    'pm': 'perl',
    't': 'perl',
    'pod': 'perl',
    'php': 'php',
    'phps': 'php',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phtml': 'php',
    'ps': 'powershell',
    'ps1': 'powershell',
    'py': 'python',
    'rb': 'ruby',
    'rbw': 'ruby',
    'sass': 'sass',
    'scss': 'scss',
    'scala': 'scala',
    'sql': 'sql',
    'svg': 'xml',
    'vb': 'vb',
    'ts': 'ts',
    'txt': 'plain',
    'xml': 'xml',
    'html': 'xml',
    'xhtml': 'xml',
    'xslt': 'xml',
    'md': 'plain',
};

# Mime match string, syntax type
MIME_TYPES = [
    ('actionscript', 'actionscript3'),
    ('applescript', 'applescript'),
    ('typescript', 'typescript'),
    ('powershell', 'powershell'),
    ('coldfusion', 'coldfusion'),
    ('plain', 'plain'),
    ('patch', 'patch'),
    ('xhtml', 'xhtml'),
    ('shell', 'shell'),
    ('text', 'plain'),
    ('bash', 'bash'),
    ('html', 'html'),
    ('diff', 'diff'),
    ('xml', 'xml'),
];

# Filename match string, syntax type
FILENAME_TYPES = [
    ('vagrantfile', 'ruby', MATCH_ALL),
    ('pkgbuild', 'bash', MATCH_ALL),
    ('bash', 'bash', MATCH_ALL),
    ('xml', 'xml', MATCH_ALL),
    ('rc', 'bash', MATCH_SUFFIX),
];

VOLUME_NOT_FOUND = 'volume_not_found'
VOLUME_NOT_FOUND_MSG = 'Volume not found'

SNAPSHOT_NOT_FOUND = 'snapshot_not_found'
SNAPSHOT_NOT_FOUND_MSG = 'Snapshot not found'

PATH_NOT_FOUND = 'path_not_found'

FILE_NOT_FOUND = 'file_not_found'
FILE_NOT_FOUND_MSG = 'File not found'
