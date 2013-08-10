from constants import *
import logging
import anydbm
import copy

logger = logging.getLogger(APP_NAME)

class Database():
    def __init__(self, db_path):
        logger.debug('Opening database...')
        self._db = anydbm.open(db_path, 'c')

    def __del__(self):
        self.sync()

    def _get_prefix(self, prefix):
        prefix_len = len(prefix)
        items = {}

        # Handle RuntimeError if database changes size while iterating
        for i in xrange(256):
            try:
                for item in self._db:
                    if item.startswith(prefix):
                        items[item[prefix_len:]] = self._db[item]
                break
            except RuntimeError:
                if i == 255:
                    raise

        return items

    def sync(self):
        logger.debug('Syncing database...')
        self._db.sync()

    def get(self, column_family, row=None, column=None):
        if not row and column:
            raise TypeError('Must specify a row for column')

        if not row:
            items = {}
            prefix_items = self._get_prefix('%s-' % column_family)

            for item in prefix_items:
                item_split = item.split('-', 1)
                if item_split[0] not in items:
                    items[item_split[0]] = {}
                items[item_split[0]][item_split[1]] = prefix_items[item]

            return items

        if not column:
            return self._get_prefix('%s-%s-' % (column_family, row))

        item_name = '%s-%s-%s' % (column_family, row, column)
        if item_name in self._db:
            return self._db[item_name]

    def set(self, column_family, row, column, value):
        self._db['%s-%s-%s' % (column_family, row, column)] = value

    def remove(self, column_family, row=None, column=None):
        if not row and column:
            raise TypeError('Must specify a row for column')

        item_name = '%s-' % column_family
        if row:
            item_name += '%s-' % row

        if not column:
            items = []

            # Handle RuntimeError if database changes size while iterating
            for i in xrange(256):
                try:
                    for item in self._db:
                        if item.startswith(item_name):
                            items.append(item)
                    break
                except RuntimeError:
                    if i == 255:
                        raise

            for item in items:
                if item in self._db:
                    del self._db[item]

        else:
            item_name += column
            if item_name in self._db:
                del self._db[item_name]
