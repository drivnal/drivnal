import os
import logging
import signal
import time
from constants import *
from database import Database

logger = None

class Server:
    def __init__(self):
        self.config = None
        self.conf_path = None
        self.app = None
        self.app_db = None
        self.scheduler = None

    def _setup_app(self):
        import flask
        self.app = flask.Flask(APP_NAME)

        global logger
        logger = self.app.logger

    def _setup_conf(self):
        from config import Config
        self.config = Config(self.conf_path)
        self.config.read()

    def _setup_log(self):
        if self.config.log_debug == 'true':
            self.log_level = logging.DEBUG
        else:
            self.log_level = logging.INFO

        if self.config.log_path:
            self.log_handler = logging.FileHandler(self.config.log_path)
        else:
            self.log_handler = logging.StreamHandler()

        global logger
        if not logger:
            logger = logging.getLogger(APP_NAME)

        logger.setLevel(self.log_level)
        self.log_handler.setLevel(self.log_level)

        self.log_handler.setFormatter(logging.Formatter(
            '[%(asctime)s][%(levelname)s][%(module)s][%(lineno)d] ' +
            '%(message)s'))

        logger.addHandler(self.log_handler)

    def _setup_db(self):
        self.app_db = Database(self.config.db_path or DEFAULT_DB_PATH)

    def _setup_handlers(self):
        import handlers

    def _setup_static_handler(self):
        www_path = self.config.www_path or DEFAULT_WWW_PATH

        from werkzeug import SharedDataMiddleware

        self.app.wsgi_app = SharedDataMiddleware(self.app.wsgi_app, {
            '/': os.path.normpath(www_path),
        }, cache=False)

        @self.app.route('/', methods=['GET'])
        def index_get():
            with open(os.path.join(www_path, 'index.html'), 'r') as fd:
                return fd.read()

    def _setup_all(self):
        self._setup_app()
        self._setup_conf()
        self._setup_log()
        self._setup_db()
        self._setup_handlers()
        self._setup_static_handler()

    def _run_wsgi(self):
        import cherrypy.wsgiserver

        logger.info('Starting server...')

        server = cherrypy.wsgiserver.CherryPyWSGIServer(
            (self.config.bind_addr, int(self.config.port)), self.app)
        try:
            server.start()
        except (KeyboardInterrupt, SystemExit), exc:
            signal.signal(signal.SIGINT, signal.SIG_IGN)
            self._stop_scheduler()
            logger.info('Stopping server...')
            server.stop()

    def _run_wsgi_debug(self):
        logger.info('Starting debug server...')

        # App.run server uses werkzeug logger
        werkzeug_logger = logging.getLogger('werkzeug')
        werkzeug_logger.setLevel(self.log_level)
        werkzeug_logger.addHandler(self.log_handler)

        try:
            self.app.run(host=self.config.bind_addr,
                port=int(self.config.port), threaded=True)
        finally:
            signal.signal(signal.SIGINT, signal.SIG_IGN)
            self._stop_scheduler()
            logger.info('Stopping server...')

    def _run_server(self):
        if self.config.debug == 'true':
            self._run_wsgi_debug()
        else:
            self._run_wsgi()

    def _start_scheduler(self):
        logger.info('Starting scheduler...')

        if self.config.scheduler != 'false':
            from scheduler import Scheduler
            self.scheduler = Scheduler()
            self.scheduler.start()

    def _stop_scheduler(self):
        logger.info('Stopping scheduler...')

        if self.scheduler:
            self.scheduler.stop()

    def run_scheduler(self):
        self._setup_conf()
        self._setup_log()
        self._setup_db()

        self._start_scheduler()

        try:
            while True:
                time.sleep(1)
        except:
            pass
        finally:
            self._stop_scheduler()

    def run_server(self):
        self._setup_all()
        self._run_server()

    def run_all(self):
        self._setup_all()
        self._start_scheduler()
        self._run_server()
