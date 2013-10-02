from constants import *
from config import Config
from local_volume import LocalVolume
from event import Event
from drivnal import server
import os
import copy
import logging

logger = logging.getLogger(APP_NAME)

class Client:
    def get_volume(self, id):
        for volume in self.get_volumes():
            if volume.id == id:
                return volume

    def get_volumes(self):
        logger.debug('Loading client volumes.')
        volumes = []

        for i, path in enumerate(server.app_db.get('system', 'volumes')):
            try:
                path = os.path.normpath(path)
            except AttributeError:
                logger.error('Failed to normalize volume path. %r' % {
                    'path': path,
                })
                continue

            try:
                volume = LocalVolume(self, path)
                volumes.append(volume)
            except IOError:
                logger.debug('Failed to load volume. %r' % {
                    'path': path,
                })

        return volumes

    def add_volume(self, path):
        logger.debug('Adding volume.')

        if not os.path.isdir(path):
            os.makedirs(path)
        volume = LocalVolume(self, path, create=True)

        logger.debug('Adding volume path to database. %r' % {
            'volume_id': volume.id,
            'path': path,
        })
        server.app_db.set('system', 'volumes', volume.path, None)

        Event(type=VOLUMES_UPDATED)

        return volume

    def remove_volume(self, volume_id):
        logger.debug('Removing volume. %r' % {
            'volume_id': volume_id,
        })

        for volume in self.get_volumes():
            if volume.id == volume_id:
                server.app_db.remove('system', 'volumes', volume.path)
                Event(type=VOLUMES_UPDATED)
                break
