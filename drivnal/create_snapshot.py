from constants import *
from exceptions import *
from task import Task
from event import Event
import os
import time
import shlex
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class CreateSnapshot(Task):
    def __init__(self, *kargs, **kwargs):
        Task.__init__(self, *kargs, **kwargs)
        self.type = CREATE_SNAPSHOT

    def _get_free_space(self, path):
        path_stat = os.statvfs(self.volume.path)
        return 1 - (1 - float(path_stat.f_bavail) /
            float(path_stat.f_blocks))

    def _check_no_space_error(self, path, log_path):
        logger.debug('Checking for no space error on %r.' % self.volume.name)

        with open(log_path) as log:
            # Get last kilobyte of file
            log.seek(0, os.SEEK_END)
            file_size = log.tell()
            log.seek(max(file_size - 1024, 0))
            lines = log.readlines()

        no_space_error = False
        for line in lines:
            if ': No space left on device (28)' in line and \
                    'write failed on' in line:
                no_space_error = True

                # Get destination file path from log then replace snapshot
                # path with source path to get the source path of file
                line = line[line.find('write failed on') + 15:line.find(
                    ': No space left on device (28)')]
                file_path = shlex.split(line)[0]
                file_path = file_path.replace(path + '.temp',
                    self.volume.source_path)

                if os.path.isfile(file_path):
                    try:
                        file_stat = os.stat(file_path)
                        return (no_space_error, file_stat.st_size)
                    except OSError:
                        logger.exception('Failed to get size of file, ' + \
                            'that caused no space error. %r' % {
                                'volume_id': self.volume_id,
                                'snapshot_id': self.snapshot_id,
                            })
                break

        return (no_space_error, None)

    def remove_snapshot(self):
        self.volume.load_snapshots()
        snapshot = self.volume.get_snapshot(self.snapshot_id)
        if snapshot:
            self.volume.remove_snapshot(snapshot, block=True)
        else:
            logger.debug('Failed to remove snapshot, snapshot id does ' + \
                'not exists.')

    def _prune_snapshot(self, snapshot):
        keep_log = False
        if snapshot.state == FAILED:
            keep_log = True
        self.volume.remove_snapshot(snapshot, keep_log, True)

    def prune_snapshots(self, min_size=None):
        snapshots = self.volume.get_snapshots()
        failed_snapshots = self.volume.get_failed_snapshots()
        snapshot_count = self.volume.get_snapshot_count()
        snapshot_limit = self.volume.snapshot_limit
        min_free_space = self.volume.min_free_space
        orig_free_space = self.volume.get_space_free()
        prune_count = 0
        max_prune = self.volume.max_prune or DEFAULT_MAX_PRUNE
        max_prune_count = (int(self.orig_snapshot_count * max_prune) -
            (self.orig_snapshot_count - snapshot_count))

        logger.debug('Pruning snapshots. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
        })

        if snapshot_limit:
            for i in xrange((snapshot_count + 1) - snapshot_limit):
                snapshot = snapshots.pop(0)
                logger.info('Exceeding snapshot limit, auto removing ' + \
                    'snapshot. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': self.snapshot_id,
                        'removing_snapshot_id': snapshot.id,
                    })
                self._prune_snapshot(snapshot)

        # If a min space needed is set and percent of volume is greater then
        # min_free_space use the percent needed + 0.02 for min free space
        if min_size:
            path_stat = os.statvfs(self.volume.path)
            percent_needed = (min_size / float(
                path_stat.f_bsize * path_stat.f_blocks)) + 0.02

            if not min_free_space or percent_needed > min_free_space:
                min_free_space = percent_needed

        if not min_free_space:
            return True

        for snapshot in failed_snapshots:
            if self.volume.get_space_free() >= min_free_space:
                return True
            logger.info('Auto removing failed snapshot. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'removing_snapshot_id': snapshot.id,
            })
            self._prune_snapshot(snapshot)

        # Remove up to the max prune count of volumes until required free
        # space has been reached
        for snapshot in snapshots:
            if self.volume.get_space_free() >= min_free_space:
                return True
            logger.info('Volume low on space, auto removing snapshot. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'removing_snapshot_id': snapshot.id,
            })
            self._prune_snapshot(snapshot)
            prune_count += 1
            if prune_count >= max_prune_count:
                break

        if self.volume.get_space_free() >= min_free_space:
            return True
        return False

    def _abort_process(self, process):
        for i in xrange(10):
            process.terminate()
            logger.debug('Terminating snapshot process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'pid': process.pid,
            })
            time.sleep(1)
            if process.poll() is not None:
                break

        if process.poll() is None:
            for i in xrange(30):
                process.kill()
                logger.debug('Killing snapshot process. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'pid': process.pid,
                })
                time.sleep(0.5)
                if process.poll() is not None:
                    break

        if process.poll() is None:
            logger.error('Failed to abort snapshot process. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'pid': process.pid,
            })

        logger.warning('Snapshot aborted, removing aborted snapshot. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
        })

        self.remove_snapshot()
        self.aborted()
        Event(type=VOLUMES_UPDATED)

    def run(self):
        self.snapshot_id = int(time.time())
        self.orig_snapshot_count = self.volume.get_snapshot_count()
        bandwidth_limit = self.volume.bandwidth_limit
        excludes = self.volume.excludes
        source_path = self.volume.source_path
        try:
            destination_path = os.path.join(self.volume.path,
                SNAPSHOT_DIR, str(self.snapshot_id))
        except AttributeError:
            logger.exception('Failed to join snapshot destination path. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })
        destination_path_temp = destination_path + '.temp'
        destination_path_failed = destination_path + '.failed'
        destination_path_warning = destination_path + '.failed'
        log_path = os.path.join(self.volume.path,
            LOG_DIR, 'snapshot_%s.log' % self.snapshot_id)
        max_retry = self.volume.max_retry or DEFAULT_MAX_RETRY
        last_snapshot = self.volume.get_last_snapshot()

        logger.info('Creating snapshot. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot_id,
            'task_id': self.id,
        })

        Event(type=VOLUMES_UPDATED)

        snapshots_path = os.path.join(self.volume.path, SNAPSHOT_DIR)
        logs_path = os.path.join(self.volume.path, LOG_DIR)

        if not os.path.isdir(snapshots_path):
            logger.debug('Creating volume snapshots directory. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })
            os.mkdir(snapshots_path)

        if not os.path.isdir(logs_path):
            logger.debug('Creating volume logs directory. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })
            os.mkdir(logs_path)

        args = ['rsync', '--archive', '--delete', '--hard-links',
            '--acls', '--quiet', '--xattrs',  '--progress', '--super',
            '--log-file-format=%o \"%f\" %l', '--log-file=%s' % log_path]

        if bandwidth_limit:
            args.append('--bwlimit=%s' % bandwidth_limit)

        if last_snapshot:
            args.append('--link-dest=%s' % last_snapshot.path)

        rsync_source_path = source_path
        if rsync_source_path[-1] != os.sep:
            rsync_source_path += os.sep

        if rsync_source_path == os.sep:
            logger.debug('Auto excluding default paths for root backup. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })
            for exclude in DEFAULT_ROOT_EXCLUDES:
                if exclude in excludes:
                    continue
                excludes.append(exclude)

        # If volume is a subdirectory of source path exclude path
        if os.path.commonprefix(
                [rsync_source_path, self.volume.path]) == rsync_source_path:
            logger.debug('Auto excluding volume path from snapshot. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot_id,
                'task_id': self.id,
            })
            path = os.path.normpath(self.volume.path.replace(
                rsync_source_path, '', 1)) + os.sep
            excludes.append(path)

        if excludes:
            for exclude in excludes:
                args.append('--exclude=%s' % exclude)

        args.append(rsync_source_path)
        args.append(destination_path_temp)

        for path in [destination_path, destination_path_temp,
                destination_path_failed]:
            if os.path.isdir(path):
                logger.error('Snapshot failed, snapshot ' + \
                    'path already exists. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': self.snapshot_id,
                        'task_id': self.id,
                        'path': path,
                    })
                raise SnapshotError

        self.prune_snapshots()

        for i in xrange(max_retry):
            process = subprocess.Popen(args)
            return_code = None

            while True:
                poll = process.poll()
                if poll is not None:
                    return_code = poll
                    break
                if self.state == ABORTING:
                    self._abort_process(process)
                    return
                time.sleep(0.5)

            if return_code != 0 and return_code not in RSYNC_WARN_EXIT_CODES:
                logger.debug('Command returned non-zero exit status. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'task_id': self.id,
                    'cmd_args': args,
                    'return_code': return_code,
                })

                # Check if error was from no space
                no_space_error, last_file_size = self._check_no_space_error(
                    destination_path, log_path)
                if no_space_error and i <= max_retry:
                    # If prune was able to free up space try again
                    if self.prune_snapshots(last_file_size):
                        logger.warning('Snapshot did not have required ' + \
                            'free space, retrying snapshot. %r' % {
                                'volume_id': self.volume_id,
                                'snapshot_id': self.snapshot_id,
                                'task_id': self.id,
                            })
                        continue

                try:
                    os.rename(destination_path_temp, destination_path_failed)
                except OSError:
                    logger.exception('Unable to rename failed snapshot. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': self.snapshot_id,
                        'task_id': self.id,
                    })

                if no_space_error:
                    logger.error('Snapshot failed, unable ' + \
                        'to free up required space. %r' % {
                            'volume_id': self.volume_id,
                            'snapshot_id': self.snapshot_id,
                            'task_id': self.id,
                            'cmd_args': args,
                            'return_code': return_code,
                        })
                    raise SnapshotError
                else:
                    logger.error('Snapshot failed, command ' + \
                        'returned non-zero exit status. %r' % {
                            'volume_id': self.volume_id,
                            'snapshot_id': self.snapshot_id,
                            'task_id': self.id,
                            'cmd_args': args,
                            'return_code': return_code,
                        })
                    raise SnapshotError
            break

        try:
            if return_code == 0:
                os.rename(destination_path_temp, destination_path)
            else:
                os.rename(destination_path_temp, destination_path_warning)
        except OSError:
            logger.exception('Snapshot failed, unable to rename ' + \
                'snapshot temp directory. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot_id,
                    'task_id': self.id,
                })
            raise SnapshotError

        self.state = COMPLETE
        Event(type=VOLUMES_UPDATED)
        Event(volume_id=self.volume_id, type=SNAPSHOTS_UPDATED)
