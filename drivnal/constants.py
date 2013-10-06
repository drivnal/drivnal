APP_NAME = 'drivnal'
APP_NAME_FORMATED = 'Drivnal'
CONF_FILENAME = '%s.conf' % APP_NAME

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
ORIGIN_UPDATED = 'origin_updated'

SNAPSHOT_DIR = 'snapshots'
LOG_DIR = 'logs'

EVENT_DB_TTL = 61000
TASK_DB_MAX = 100
MAX_TEXT_SIZE = 20971520

SMTP_TIMEOUT = 30
SMTP_FROM_ADDR = 'notify@drivnal.com'
SMTP_SUBJECT = 'Drivnal Notification'

MATCH_ALL = 'match_all'
MATCH_BOTH = 'match_both'
MATCH_PREFIX = 'match_prefix'
MATCH_SUFFIX = 'match_suffix'

DEFAULT_MAX_PRUNE = 0.8
DEFAULT_DATA_PATH = '/var/lib/drivnal'
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
    'abap': 'abap',
    'as': 'actionscript',
    'adb': 'ada',
    'ads': 'ada',
    'x86': 'assembly_x86',
    'ahk': 'autohotkey',
    'bat': 'batchfile',
    'cmd': 'batchfile',
    'c': 'c_cpp',
    'w': 'c_cpp',
    'cpp': 'c_cpp',
    'cxx': 'c_cpp',
    'h': 'c_cpp',
    'hh': 'c_cpp',
    'hxx': 'c_cpp',
    'h++': 'c_cpp',
    'tcc': 'c_cpp',
    'cs': 'csharp',
    'csx': 'csharp',
    'cob': 'cobol',
    'cbl': 'cobol',
    'ccp': 'cobol',
    'cobol': 'cobol',
    'cpy': 'cobol',
    'clj': 'clojure',
    'cljs': 'clojure',
    'cljx': 'clojure',
    'coffee': 'coffee',
    '_coffee': 'coffee',
    'cson': 'coffee',
    'iced': 'coffee',
    'cfm': 'coldfusion',
    'cfc': 'coldfusion',
    'css': 'css',
    'd': 'd',
    'di': 'd',
    'dart': 'dart',
    'diff': 'diff',
    'mustache': 'django',
    'jinja': 'django',
    'dot': 'dot',
    'gv': 'dot',
    'erl': 'erlang',
    'hrl': 'erlang',
    'fth': 'forth',
    '4th': 'forth',
    'glsl': 'glsl',
    'fp': 'glsl',
    'frag': 'glsl',
    'geom': 'glsl',
    'glslv': 'glsl',
    'shader': 'glsl',
    'vert': 'glsl',
    'go': 'golang',
    'groovy': 'groovy',
    'haml': 'haml',
    'haml.deface': 'haml',
    'html.haml.deface': 'haml',
    'hs': 'haskell',
    'hsc': 'haskell',
    'hx': 'haxe',
    'hxsl': 'haxe',
    'htm': 'html',
    'html': 'html',
    'xhtml': 'html',
    'ini': 'ini',
    'cfg': 'ini',
    'prefs': 'ini',
    'properties': 'ini',
    'java': 'java',
    'js': 'javascript',
    '_js': 'javascript',
    'bones': 'javascript',
    'jake': 'javascript',
    'jsfl': 'javascript',
    'jsm': 'javascript',
    'jss': 'javascript',
    'pac': 'javascript',
    'sjs': 'javascript',
    'ssjs': 'javascript',
    'json': 'json',
    'jq': 'jsoniq',
    'jqy': 'jsoniq',
    'jsp': 'jsp',
    'jsx': 'jsx',
    'jl': 'julia',
    'aux': 'latex',
    'dtx': 'latex',
    'ins': 'latex',
    'ltx': 'latex',
    'sty': 'latex',
    'toc': 'latex',
    'less': 'less',
    'lisp': 'lisp',
    'asd': 'lisp',
    'lsp': 'lisp',
    'ny': 'lisp',
    'podsl': 'lisp',
    'ls': 'livescript',
    '_ls': 'livescript',
    'lua': 'lua',
    'nse': 'lua',
    'rbxs': 'lua',
    'mk': 'makefile',
    'mak': 'makefile',
    'md': 'markdown',
    'markdown': 'markdown',
    'mkd': 'markdown',
    'mkdown': 'markdown',
    'ron': 'markdown',
    'matlab': 'matlab',
    'm': 'objectivec',
    'mm': 'objectivec',
    'ml': 'ocaml',
    'mli': 'ocaml',
    'mll': 'ocaml',
    'mly': 'ocaml',
    'eliomi': 'ocaml',
    'pas': 'pascal',
    'dfm': 'pascal',
    'lpr': 'pascal',
    'pl': 'perl',
    'nqp': 'perl',
    'perl': 'perl',
    'ph': 'perl',
    'plx': 'perl',
    'pm6': 'perl',
    'pod': 'perl',
    'psgi': 'perl',
    'php': 'php',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phpt': 'php',
    'aw': 'php',
    'ctp': 'php',
    'phtml': 'php',
    'txt': 'plain_text',
    'ps1': 'powershell',
    'pro': 'prolog',
    'py': 'python',
    'gyp': 'python',
    'pyt': 'python',
    'pyw': 'python',
    'wsgi': 'python',
    'xpy': 'python',
    'r': 'r',
    'rhtml': 'rhtml',
    'rb': 'ruby',
    'rbw': 'ruby',
    'rbx': 'ruby',
    'builder': 'ruby',
    'gemspec': 'ruby',
    'god': 'ruby',
    'irbrc': 'ruby',
    'podspec': 'ruby',
    'rbuild': 'ruby',
    'ru': 'ruby',
    'thor': 'ruby',
    'watchr': 'ruby',
    'rs': 'rust',
    'sass': 'sass',
    'scala': 'scala',
    'scm': 'scheme',
    'sls': 'scheme',
    'ss': 'scheme',
    'scss': 'scss',
    'sh': 'sh',
    'tmux': 'sh',
    'bashrc': 'sh',
    'sql': 'sql',
    'svg': 'svg',
    'tcl': 'tcl',
    'tex': 'tex',
    'textile': 'textile',
    'tmsnippet': 'tmsnippet',
    'tmcommand': 'tmsnippet',
    'tmlanguage': 'tmsnippet',
    'tmpreferences': 'tmsnippet',
    'tmtheme': 'tmsnippet',
    'toml': 'toml',
    'twig': 'twig',
    'ts': 'typescript',
    'vbs': 'vbscript',
    'v': 'verilog',
    'sv': 'verilog',
    'svh': 'verilog',
    'vh': 'verilog',
    'xml': 'xml',
    'axml': 'xml',
    'ccxml': 'xml',
    'dita': 'xml',
    'ditamap': 'xml',
    'ditaval': 'xml',
    'glade': 'xml',
    'grxml': 'xml',
    'kml': 'xml',
    'mxml': 'xml',
    'plist': 'xml',
    'pt': 'xml',
    'rdf': 'xml',
    'rss': 'xml',
    'scxml': 'xml',
    'tml': 'xml',
    'ui': 'xml',
    'vxml': 'xml',
    'wsdl': 'xml',
    'wxi': 'xml',
    'wxl': 'xml',
    'wxs': 'xml',
    'x3d': 'xml',
    'xaml': 'xml',
    'xlf': 'xml',
    'xliff': 'xml',
    'xmi': 'xml',
    'xsd': 'xml',
    'xul': 'xml',
    'zcml': 'xml',
    'xquery': 'xquery',
    'xq': 'xquery',
    'xqy': 'xquery',
    'yml': 'yaml',
    'reek': 'yaml',
    'yaml': 'yaml',
};

# Mime match string, syntax type
MIME_TYPES = [
    ('actionscript', 'actionscript'),
    ('typescript', 'typescript'),
    ('powershell', 'powershell'),
    ('coldfusion', 'coldfusion'),
    ('makefile', 'makefile'),
    ('plain', 'plain_text'),
    ('xhtml', 'xhtml'),
    ('shell', 'sh'),
    ('text', 'plain_text'),
    ('bash', 'sh'),
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

TASK_NOT_FOUND = 'task_not_found'
TASK_NOT_FOUND_MSG = 'Task not found'

PATH_NOT_FOUND = 'path_not_found'

FILE_NOT_FOUND = 'file_not_found'
FILE_NOT_FOUND_MSG = 'File not found'
