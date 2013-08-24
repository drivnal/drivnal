from constants import *
import os
import logging

logger = logging.getLogger(APP_NAME)

class Config:
    def __init__(self, path):
        self._config_path = path
        self.set_state(CLOSED)

    def __setattr__(self, name, value):
        if name[0] != '_':
            self.set_state(UNSAVED)
        self.__dict__[name] = value

    def __getattr__(self, name):
        if name[0] == '_':
            raise AttributeError('Object instance has no attribute %r' % name)
        return None

    def get_state(self):
        return self._state

    def set_state(self, state):
        self._state = state

    def read(self):
        logger.debug('Reading config.')

        with open(self._config_path) as config:
            for line in config:
                line = line.rstrip('\n')

                if line.strip() == '':
                    continue

                elif line[0] == '#':
                    continue

                elif '=' in line:
                    line_split = line.split('=')

                    try:
                        name = line_split[0]
                        value = '='.join(line_split[1:])

                        # If option name ends with s assume list
                        if name[-1] == 's' and name[-2:] != 'ss':
                            value = value.split(',')
                            value[:] = [x for x in value if x != '']

                    except ValueError:
                        logger.warning('Ignoring invalid line. %r' % {
                            'line': line,
                        })
                        continue
                    setattr(self, name, value)

                else:
                    logger.warning('Ignoring invalid line. %r' % {
                        'line': line,
                    })

        self.set_state(SAVED)

    def write(self):
        logger.debug('Writing config.')

        with open(self._config_path, 'w') as config:
            for name in sorted(vars(self).keys()):
                value = vars(self)[name]

                if name[0] == '_':
                    continue
                # If option name ends with s assume list
                elif name[-1] == 's' and name[-2:] != 'ss':
                    value = ','.join(value)
                elif value is None:
                    continue

                config.write('%s=%s\n' % (name, value))

        self.set_state(SAVED)
