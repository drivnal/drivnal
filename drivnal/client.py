from constants import *
from config import Config
from volume import Volume
from drivnal import server
from event import Event
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

        for i, volume_path in enumerate(
                server.app_db.get('system', 'volumes')):
            try:
                volume_path = os.path.normpath(volume_path)
            except AttributeError:
                logger.error('Failed to normalize volume path. %r' % {
                    'volume_num': i,
                })
                continue

            try:
                volume = Volume(volume_path)
                volumes.append(volume)
            except IOError:
                logger.debug('Failed to load volume. %r' % {
                    'volume_num': i,
                })

        return volumes

    def create_volume(self, path):
        logger.debug('Creating volume.')

        if not os.path.isdir(path):
            os.mkdir(path)
        volume = Volume(path)

        logger.debug('Adding volume path to database. %r' % {
            'volume_id': volume.id,
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
