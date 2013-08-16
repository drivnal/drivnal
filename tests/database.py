from constants import *
from drivnal import database
import threading
import unittest
import os

class Database(unittest.TestCase):
    def setUp(self):
        if os.path.isfile(TEMP_DATABSE_PATH):
            os.remove(TEMP_DATABSE_PATH)
        self._db = database.Database(TEMP_DATABSE_PATH)

    def tearDown(self):
        os.remove(TEMP_DATABSE_PATH)

    def _fill_column_family(self, num):
        for i in xrange(3):
            for x in xrange(3):
                self._db.set('column_family_%s' % num, 'row_%s' % i,
                    'column_%s' % x, 'value_%s' % x)

        for i in xrange(3):
            for x in xrange(3):
                value = self._db.get('column_family_%s' % num,
                    'row_%s' % i, 'column_%s' % x)
                self.assertEqual(value, 'value_%s' % x)

        for i in xrange(3):
            for x in xrange(3):
                self._db.remove('column_family_%s' % num,
                    'row_%s' % i, 'column_%s' % x)

        for i in xrange(3):
            for x in xrange(3):
                value = self._db.get('column_family_%s' % num,
                    'row_%s' % i, 'column_%s' % x)
                self.assertEqual(value, None)

    def test_database(self):
        for i in xrange(3):
            threads = []
            for x in xrange(10):
                thread = threading.Thread(target=self._fill_column_family,
                    args=(x,))
                thread.start()
                threads.append(thread)

            for thread in threads:
                thread.join()
