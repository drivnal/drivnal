from constants import *
from client import Client
import time
import logging
import threading

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
            self.check_schedule(localtime)

    def _create_snapshot(self, volume):
        volume.create_snapshot()

    def _check_volume_schedule(self, localtime, volume):
        schedule = volume.schedule

        try:
            time_num = int(''.join([x for x in schedule if x.isdigit()]))
        except ValueError:
            time_num = None
        time_unit = ''.join([x for x in schedule if x.isalpha()]).lower()

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

        for volume in client.volumes:
            self._check_volume_schedule(localtime, volume)

    def start(self):
        self.interrupt = None
        self.thread = threading.Thread(
            target=self._run)
        self.thread.start()

    def stop(self):
        self.interrupt = True
        self.thread.join()
