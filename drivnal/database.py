from constants import *
import threading
import logging
import copy

logger = logging.getLogger(APP_NAME)

class BerkeleyBackend:
    def __init__(self, db_path):
        logger.info('Opening berkeley database...')

        try:
            import bsddb3 as bsddb
        except ImportError:
            import bsddb

        self._db = bsddb.db.DB()
        self._db.open(db_path, bsddb.db.DB_HASH, bsddb.db.DB_CREATE)

    def get(self, key):
        return self._db.get(key=key)

    def set(self, key, value):
        self._db.put(key=key, data=value)

    def remove(self, key):
        self._db.delete(key=key)

    def keys(self):
        return self._db.keys()

    def sync(self):
        self._db.sync()

class DebugBackend:
    def __init__(self):
        logger.info('Creating debug database...')
        self._data = {}

    def get(self, key):
        if key in self._data:
            return self._data[key]

    def set(self, key, value):
        self._data[key] = str(value)

    def remove(self, key):
        if key in self._data:
            del self._data[key]

    def keys(self):
        keys = []
        for key in self._data:
            keys.append(key)
        return keys

    def sync(self):
        pass

class Database:
    def __init__(self, db_path):
        self._db_lock = threading.Lock()

        if db_path is None:
            self._db = DebugBackend()
        else:
            self._db = BerkeleyBackend(db_path)

    def _get(self, key):
        self._db_lock.acquire()
        try:
            value = self._db.get(key)
        finally:
            self._db_lock.release()
        return value

    def _prefix_get(self, prefix):
        prefix_len = len(prefix)
        keys = {}

        self._db_lock.acquire()
        try:
            for key in self._db.keys():
                if key.startswith(prefix):
                    keys[key[prefix_len:]] = self._db.get(key)
        finally:
            self._db_lock.release()

        return keys

    def _set(self, key, value):
        self._db_lock.acquire()
        try:
            self._db.set(key, value)
            self._db.sync()
        finally:
            self._db_lock.release()

    def _remove(self, key):
        self._db_lock.acquire()
        try:
            self._db.remove(key)
            self._db.sync()
        except bsddb.db.DBNotFoundError:
            pass
        finally:
            self._db_lock.release()

    def _prefix_remove(self, prefix):
        prefix_len = len(prefix)

        self._db_lock.acquire()
        try:
            for key in self._db.keys():
                if key.startswith(prefix):
                    self._db.remove(key)
            self._db.sync()
        finally:
            self._db_lock.release()

    def get(self, column_family, row=None, column=None):
        if not row and column:
            raise TypeError('Must specify a row for column')

        if not row:
            keys = {}
            prefix_keys = self._prefix_get('%s-' % column_family)

            for key in prefix_keys:
                key_split = key.split('-', 1)
                if key_split[0] not in keys:
                    keys[key_split[0]] = {}
                keys[key_split[0]][key_split[1]] = prefix_keys[key]

            return keys

        if not column:
            return self._prefix_get('%s-%s-' % (column_family, row))

        key_name = '%s-%s-%s' % (column_family, row, column)
        return self._get(key_name)

    def set(self, column_family, row, column, value):
        self._set('%s-%s-%s' % (column_family, row, column), value)

    def remove(self, column_family, row=None, column=None):
        if not row and column:
            raise TypeError('Must specify a row for column')

        key_name = '%s-' % column_family
        if row:
            key_name += '%s-' % row

        if not column:
            self._prefix_remove(key_name)
        else:
            key_name += column
            self._remove(key_name)
