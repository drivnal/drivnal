from constants import *
from exceptions import *
from client import Client
from event import Event
from task import Task
from messenger import Messenger
import time
import logging
import threading
import traceback

logger = logging.getLogger(APP_NAME)

class Scheduler:
    def __init__(self):
        self.interrupt = None
        self.thread = None

    def _run(self):
        last_check = time.localtime().tm_min

        while not self.interrupt:
            localtime = time.localtime()

            if localtime.tm_min == last_check:
                time.sleep(1)
                continue
            last_check = localtime.tm_min

            try:
                self.check_schedule(localtime)
            except:
                logger.exception('Scheduler failed to check schedule.')

            try:
                # Clean database every 10 min
                if (int(time.mktime(localtime)) / 60) % 10 == 0:
                    self.clean_database()
            except:
                logger.exception('Scheduler failed to clean database.')

    def _create_snapshot(self, volume):
        try:
            volume.create_snapshot()
        except SnapshotAlreadyRunning:
            logger.debug('Snapshot already running, skipping scheduled ' + \
                'snapshot. %r' % {
                    'volume_id': volume.id,
                })
        except:
            logger.exception('Scheduler failed to call create_snapshot. %r' % {
                'volume_id': volume.id,
            })

    def _check_volume_schedule(self, localtime, volume):
        if not volume.schedule:
            return
        schedule = volume.schedule.lower()

        if schedule == 'none':
            return

        try:
            time_num = int(''.join([x for x in schedule if x.isdigit()]))
        except ValueError:
            time_num = None
        time_unit = ''.join([x for x in schedule if x.isalpha()])

        if time_unit in WEEKDAY_UNITS:
            if (localtime.tm_hour == 4 and
                    localtime.tm_min == 0 and
                    localtime.tm_wday == WEEKDAY_UNITS[time_unit]):
                self._create_snapshot(volume)
        else:
            time_unit = time_unit.replace('s', '')

        if time_unit in MIN_UNITS:
            if (int(time.mktime(localtime)) / 60) % time_num == 0:
                self._create_snapshot(volume)
        elif time_unit in HOUR_UNITS:
            if ((int(time.mktime(localtime)) / 60 / 60) % time_num == 0
                    and localtime.tm_min == 0):
                self._create_snapshot(volume)
        elif time_unit in DAY_UNITS:
            if (localtime.tm_hour == 4 and
                    localtime.tm_min == 0 and
                    ((localtime.tm_yday - 1) % time_num) == 0):
                self._create_snapshot(volume)

    def check_schedule(self, localtime):
        client = Client()

        for volume in client.get_volumes():
            try:
                self._check_volume_schedule(localtime, volume)
            except:
                error_msg = 'Scheduler failed to check volume schedule. %r' % {
                    'volume_id': volume.id
                }
                logger.exception(error_msg)
                msg = Messenger(volume)
                msg.send('%s\n\n%s' % (error_msg, traceback.format_exc()))

    def clean_database(self):
        Task.clean_database()
        Event.clean_database()

    def start(self):
        self.interrupt = None
        self.thread = threading.Thread(target=self._run)
        self.thread.start()

    def stop(self):
        self.interrupt = True
        self.thread.join()
