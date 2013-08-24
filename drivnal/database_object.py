from constants import *
from drivnal import server
import logging

logger = logging.getLogger(APP_NAME)

_RESERVED_ATTRIBUTES = ['column_family', 'str_columns', 'int_columns',
    'cached_columns', 'required_columns']

class DatabaseObject:
    column_family = 'column_family'
    str_columns = []
    int_columns = []
    cached_columns = []
    required_columns = []

    def __setattr__(self, name, value):
        if name in _RESERVED_ATTRIBUTES:
            self.__dict__[name] = value
            return

        if name in self.str_columns:
            server.app_db.set(self.column_family, self.id, name, value)
        elif name in self.int_columns:
            server.app_db.set(self.column_family, self.id, name, str(value))
        else:
            self.__dict__[name] = value

        if name in self.cached_columns:
            self.__dict__[name] = value

    def __getattr__(self, name):
        if name in _RESERVED_ATTRIBUTES:
            return self.__dict__[name]

        if name in self.cached_columns and name in self.__dict__:
            return self.__dict__[name]
        elif name in self.str_columns:
            return server.app_db.get(self.column_family, self.id, name)
        elif name in self.int_columns:
            value = server.app_db.get(self.column_family, self.id, name)
            if value:
                return int(value)
            return None
        elif name not in self.__dict__:
            raise AttributeError('Object instance has no attribute %r' % name)
        return self.__dict__[name]

    @staticmethod
    def validate(db_obj, row, columns):
        valid = True

        for column in db_obj.required_columns:
            if column not in columns:
                valid = False
                break

            if column in db_obj.int_columns:
                try:
                    int(columns[column])
                except ValueError:
                    valid = False
                    break

        if valid:
            if 'remove' in columns:
                logger.info('Prevented removal of partially complete' + \
                    ' %s. %r' % (db_obj.column_family, {
                        'event_id': row,
                    }))
                server.app_db.remove(db_obj.column_family, row, 'remove')
        else:
            # Remove broken rows
            if 'remove' in columns:
                logger.info(('Removing broken %s from ' + \
                    'database. %r') % (db_obj.column_family, {
                        '%s_id' % db_obj.column_family: row,
                    }))
                server.app_db.remove(db_obj.column_family, row)
            else:
                logger.debug(('Queueing removal of broken %s from' + \
                    ' database. %r') % (db_obj.column_family, {
                        '%s_id' % db_obj.column_family: row,
                    }))
                # Its possible row is currently being created and will
                # be valid once created. Wait for next db clean to
                # revalidate and remove row.
                server.app_db.set(db_obj.column_family, row, 'remove', 'true')

        return valid
