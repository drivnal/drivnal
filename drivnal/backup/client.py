from drivnal.constants import *
from drivnal import server
from config import Config
from volume import Volume
import os
import copy
import logging

class Client:
    def __init__(self):
        pass

    def __getattr__(self, name):
        if name in ['volumes']:
            self.load()

        if name not in self.__dict__:
            raise AttributeError('Object instance has no attribute %r' % name)
        return self.__dict__[name]

    def get_volume(self, id):
        for volume in self.volumes:
            if volume.id == id:
                return volume

    def create_volume(self, path):
        logging.debug('Creating volume.')

        if not os.path.isdir(path):
            os.mkdir(path)
        volume = Volume(self, path)

        self.volumes.append(volume)
        logging.debug('Adding volume path to config. %r' % {
            'volume_id': volume.id,
        })
        self.commit()

        return volume

    def remove_volume(self, volume):
        logging.debug('Removing volume. %r' % {
            'volume_id': volume.id,
        })

        self.volumes.remove(volume)
        self.commit()

    def load(self):
        logging.debug('Loading client database.')
        self.volumes = []

        for i, volume_path in enumerate(
                server.app_db.get('system', 'volumes')):

            try:
                volume_path = os.path.normpath(volume_path)
            except AttributeError:
                logging.error('Failed to normalize volume path. %r' % {
                    'volume_num': i,
                })
            try:
                volume = Volume(self, volume_path)
                self.volumes.append(volume)
            except IOError:
                logging.debug('Failed to load volume. %r' % {
                    'volume_num': i,
                })

    def commit(self):
        logging.debug('Writing client database.')

        server.app_db.remove('system', 'volumes')
        for volume in self.volumes:
            server.app_db.set('system', 'volumes', volume.path, None)
