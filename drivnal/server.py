import os
import flask
import cherrypy.wsgiserver
import logging
from constants import *
from database import Database
from werkzeug import SharedDataMiddleware

logger = None

class Server:
    def __init__(self):
        self.config = None
        self.conf_path = None
        self.app = None
        self.app_db = None

    def _setup_app(self):
        self.app = flask.Flask(APP_NAME)

        global logger
        logger = self.app.logger

        from backup.config import Config
        self.config = Config(self.conf_path)
        self.config.read()

        if self.config.log_path:
            handler = logging.FileHandler(self.config.log_path)
        else:
            handler = logging.StreamHandler()

        if self.config.log_debug == 'true':
            logger.setLevel(logging.DEBUG)
            handler.setLevel(logging.DEBUG)
        else:
            logger.setLevel(logging.INFO)
            handler.setLevel(logging.INFO)

        handler.setFormatter(logging.Formatter(
            '[%(asctime)s][%(levelname)s][%(module)s][%(lineno)d] ' +
            '%(message)s'))

        logger.addHandler(handler)

        self.app_db = Database(self.config.db_path or DEFAULT_DB_PATH)

        import handlers

    def _setup_static(self):
        www_path = self.config.www_path or DEFAULT_WWW_PATH

        self.app.wsgi_app = SharedDataMiddleware(self.app.wsgi_app, {
            '/': os.path.normpath(www_path),
        }, cache=False)

        @self.app.route('/', methods=['GET'])
        def index_get():
            with open(os.path.join(www_path, 'index.html'), 'r') as fd:
                return fd.read()

    def _start_debug(self):
        try:
            self.app.run(host=self.config.bind_addr,
                port=int(self.config.port), threaded=True)
        finally:
            self.app_db.sync()

    def _start(self):
        from backup.scheduler import Scheduler
        scheduler = Scheduler()
        scheduler.start()

        server = cherrypy.wsgiserver.CherryPyWSGIServer(
            (self.config.bind_addr, int(self.config.port)), self.app)
        try:
            server.start()
        except (KeyboardInterrupt, SystemExit), exc:
            scheduler.stop()
            server.stop()
            self.app_db.sync()

    def start(self):
        self._setup_app()
        self._setup_static()

        logger.info('Starting server...')

        if self.config.debug == 'true':
            self._start_debug()
        else:
            self._start()
