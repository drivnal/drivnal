from constants import *
from bucket import Bucket
import utils
import os
import time
import shlex
import datetime
import logging

logger = logging.getLogger(APP_NAME)

class CoreSnapshot(Bucket):
    def __init__(self, volume, dir_name=None):
        self.volume = volume

        if dir_name:
            if dir_name[-7:] == '.%s' % FAILED:
                self.id = int(dir_name[:-7])
                self.state = FAILED
            elif dir_name[-9:] == '.%s' % REMOVING:
                self.id = int(dir_name[:-9])
                self.state = REMOVING
            elif dir_name[-8:] == '.%s' % PENDING:
                self.id = int(dir_name[:-8])
                self.state = PENDING
            elif dir_name[-8:] == '.%s' % WARNING:
                self.id = int(dir_name[:-8])
                self.state = WARNING
            else:
                self.id = int(dir_name)
                self.state = COMPLETE
        else:
            self.id = int(time.time())
            self.state = PENDING

    def __getattr__(self, name):
        if name in ['runtime', 'sent', 'received', 'speed']:
            self.parse_log_file()
        elif name == 'path':
            return self._get_path()
        elif name == 'log_path':
            return self._get_log_path()

        if name not in self.__dict__:
            raise AttributeError(
                'Snapshot instance has no attribute %r' % name)
        return self.__dict__[name]

    def log_read(self):
        try:
            with open(self.log_path) as file_data:
                return file_data.read()
        except OSError, error:
            logger.warning('Failed to read snapshot log file. %r' % {
                'volume_id': self.volume.id,
                'snapshot_id': self.id,
                'error': error,
            })
            return

    def log_size(self):
        try:
            return os.path.getsize(self.log_path)
        except OSError, error:
            logger.warning('Failed to get snapshot log file size. %r' % {
                'volume_id': self.volume.id,
                'snapshot_id': self.id,
                'error': error,
            })
            return

    def parse_log_file(self):
        self.runtime = None
        self.sent = None
        self.received = None
        self.speed = None

        logger.debug('Parsing log file for snapshot. %r' % {
            'volume_id': self.volume.id,
            'snapshot_id': self.id,
        })

        try:
            with open(self.log_path) as log:
                start_time = None
                line = log.readline()

                try:
                    line_split = shlex.split(line)

                    if len(line_split) >= 2:
                        # Get epoch time
                        epoch = line_split[0] + 'T' + line_split[1]
                        epoch = datetime.datetime.strptime(epoch,
                            '%Y/%m/%dT%H:%M:%S')
                        start_time = int(time.mktime(epoch.timetuple()))
                    else:
                        logger.warning('Failed to get snapshot start ' + \
                            'time from log, line split length invalid. %r' % {
                                'volume_id': self.volume.id,
                                'snapshot_id': self.id,
                                'log_line': line,
                            })

                except ValueError:
                    logger.warning('Failed to get snapshot start ' + \
                        'time from log, value error. %r' % {
                            'volume_id': self.volume.id,
                            'snapshot_id': self.id,
                            'log_line': line,
                        })

                # Get last kilobyte of file
                log.seek(0, os.SEEK_END)
                file_size = log.tell()
                log.seek(max(file_size - 1024, 0))
                lines = log.readlines()

                # Find rsync sent command line output
                for line in lines:
                    try:
                        line_split = shlex.split(line)
                    except ValueError:
                        continue

                    if len(line_split) < 10:
                        continue

                    # Get rsync command
                    command = line_split[3]
                    if command == 'sent':
                        if start_time:
                            # Get runtime
                            epoch = line_split[0] + 'T' + line_split[1]
                            epoch = datetime.datetime.strptime(epoch,
                                '%Y/%m/%dT%H:%M:%S')
                            epoch = int(time.mktime(epoch.timetuple()))
                            self.runtime = utils.format_seconds(
                                epoch - start_time)

                        # Get snapshot info
                        try:
                            self.sent = utils.format_bytes(line_split[4])
                        except ValueError:
                            logger.warning('Failed to get sent bytes ' + \
                                'from snapshot log, value error. %r' % {
                                    'volume_id': self.volume.id,
                                    'snapshot_id': self.id,
                                    'log_line': line,
                                })

                        try:
                            self.received = utils.format_bytes(line_split[7])
                        except ValueError:
                            logger.warning('Failed to get received bytes ' + \
                                'from snapshot log, value error. %r' % {
                                    'volume_id': self.volume.id,
                                    'snapshot_id': self.id,
                                    'log_line': line,
                                })

                        try:
                            self.speed = utils.format_bytes(
                                line_split[9]) + '/sec'
                        except ValueError:
                            logger.warning('Failed to get transfer speed ' + \
                                'from snapshot log, value error. %r' % {
                                    'volume_id': self.volume.id,
                                    'snapshot_id': self.id,
                                    'log_line': line,
                                })
        except IOError:
            logger.debug('Failed to read log file for ' + \
                'snapshot, IOError. %r' % {
                    'volume_id': self.volume.id,
                    'snapshot_id': self.id,
                })

    def _get_path(self):
        return ''

    def _get_log_path(self):
        return ''

    def _setup_snapshot(self, last_snapshot):
        pass

    def set_state(self, state):
        if self.state == state:
            return
        self.state = state
