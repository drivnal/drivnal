from constants import *
from exceptions import *
from exec_task import ExecTask
from event import Event
import os
import time
import shlex
import logging
import subprocess

logger = logging.getLogger(APP_NAME)

class CreateSnapshot(ExecTask):
    type = CREATE_SNAPSHOT

    def remove_snapshot(self):
        self.volume.remove_snapshot(self.snapshot, block=True)

    def _prune_snapshot(self, snapshot):
        keep_log = False
        if snapshot.state == FAILED:
            keep_log = True
        self.volume.remove_snapshot(snapshot, keep_log, True)

    def prune_snapshots(self):
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
            'snapshot_id': self.snapshot.id,
        })

        for snapshot in failed_snapshots:
            logger.info('Auto removing failed snapshot. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot.id,
                'removing_snapshot_id': snapshot.id,
            })
            self._prune_snapshot(snapshot)

        if snapshot_limit:
            for i in xrange((snapshot_count + 1) - snapshot_limit):
                snapshot = snapshots.pop(0)
                logger.info('Exceeding snapshot limit, auto removing ' + \
                    'snapshot. %r' % {
                        'volume_id': self.volume_id,
                        'snapshot_id': self.snapshot.id,
                        'removing_snapshot_id': snapshot.id,
                    })
                self._prune_snapshot(snapshot)

        if not min_free_space:
            return True

        # Remove up to the max prune count of volumes until required free
        # space has been reached
        for snapshot in snapshots:
            if self.volume.get_space_free() >= min_free_space:
                return True
            logger.info('Volume low on space, auto removing snapshot. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot.id,
                'removing_snapshot_id': snapshot.id,
            })
            self._prune_snapshot(snapshot)
            prune_count += 1
            if prune_count >= max_prune_count:
                break

        if self.volume.get_space_free() >= min_free_space:
            return True
        return False

    def _pre_aborted(self):
        self.remove_snapshot()

    def _post_aborted(self):
        Event(type=VOLUMES_UPDATED)

    def run(self):
        self.snapshot = self.volume.SnapshotClass(self.volume)
        self.snapshot_id = self.snapshot.id
        self.orig_snapshot_count = self.volume.get_snapshot_count()
        bandwidth_limit = self.volume.bandwidth_limit
        excludes = self.volume.excludes or []
        source_path = self.volume.source_path
        destination_path = self.snapshot.path
        self.log_path = self.snapshot.log_path
        last_snapshot = self.volume.get_last_snapshot()
        last_snapshot_id = None
        if last_snapshot:
            last_snapshot_id = last_snapshot.id

        logger.info('Creating snapshot. %r' % {
            'volume_id': self.volume_id,
            'snapshot_id': self.snapshot.id,
            'last_snapshot_id': last_snapshot_id,
            'task_id': self.id,
        })

        Event(type=VOLUMES_UPDATED)

        args = ['rsync', '--archive', '--delete', '--hard-links', '--acls',
            '--quiet', '--xattrs',  '--progress', '--stats', '--super',
            '--log-file-format=%o \"%f\" %l', '--log-file=%s' % self.log_path]

        if bandwidth_limit:
            args.append('--bwlimit=%s' % bandwidth_limit)

        rsync_source_path = source_path
        if rsync_source_path[-1] != os.sep:
            rsync_source_path += os.sep

        if rsync_source_path == os.sep:
            logger.debug('Auto excluding default paths for root backup. %r' % {
                'volume_id': self.volume_id,
                'snapshot_id': self.snapshot.id,
                'task_id': self.id,
            })
            for exclude in DEFAULT_ROOT_EXCLUDES:
                if exclude in excludes:
                    continue
                excludes.append(exclude)

        auto_excludes = self.volume._get_auto_excludes()
        if auto_excludes:
            excludes += auto_excludes

        for exclude in excludes:
            args.append('--exclude=%s' % exclude)

        setup_args = self.snapshot._setup_snapshot(last_snapshot)
        if setup_args:
            args += setup_args

        args.append(rsync_source_path)
        args.append(destination_path)

        self.prune_snapshots()

        return_code = self._exec(args)
        if return_code is None:
            return

        if return_code != 0 and return_code not in RSYNC_WARN_EXIT_CODES:
            self.snapshot.set_state(FAILED)
            logger.error('Snapshot failed, command ' + \
                'returned non-zero exit status. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot.id,
                    'task_id': self.id,
                    'cmd_args': args,
                    'return_code': return_code,
                })
            raise SnapshotError

        try:
            if return_code == 0:
                self.snapshot.set_state(COMPLETE)
            else:
                self.snapshot.set_state(WARNING)
        except OSError:
            logger.exception('Snapshot failed, unable to rename ' + \
                'snapshot temp directory. %r' % {
                    'volume_id': self.volume_id,
                    'snapshot_id': self.snapshot.id,
                    'task_id': self.id,
                })
            raise SnapshotError

        self.state = COMPLETE

    def post_run(self):
        Event(type=VOLUMES_UPDATED)
        Event(volume_id=self.volume_id, type=SNAPSHOTS_UPDATED)
