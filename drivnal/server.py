import os
import flask
import cherrypy.wsgiserver
from constants import *
from database import Database
from werkzeug import SharedDataMiddleware

class Server:
    def __init__(self):
        self.config = None
        self.conf_path = None
        self.app = None
        self.app_db = None

    def _setup_app(self):
        from backup.config import Config
        self.config = Config(self.conf_path)
        self.config.read()

        db_path = self.config.db_path
        if not db_path:
            db_path = DEFAULT_DB_PATH

        self.app = flask.Flask(APP_NAME)
        self.app_db = Database(db_path)
        import handlers

    def _setup_static(self):
        www_path = self.config.www_path
        if not www_path:
            www_path = DEFAULT_WWW_PATH

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

        if self.config.debug:
            self._start_debug()
        else:
            self._start()
