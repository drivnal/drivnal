from drivnal.constants import *
import os
import logging

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
        logging.debug('Reading config.')

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

                        if name[-1] == 's':
                            value = value.split(',')
                            value[:] = [x for x in value if x != '']

                    except ValueError:
                        logging.warning('Ignoring invalid line. %r' % {
                            'line': line,
                        })
                        continue
                    setattr(self, name, value)

                else:
                    logging.warning('Ignoring invalid line. %r' % {
                        'line': line,
                    })

        self.set_state(SAVED)

    def write(self):
        logging.debug('Writing config.')

        with open(self._config_path, 'w') as config:
            for name in sorted(vars(self).keys()):
                value = vars(self)[name]

                if name[0] == '_':
                    continue
                elif name[-1] == 's':
                    value = ','.join(value)
                elif value is None:
                    continue

                config.write('%s=%s\n' % (name, value))

        self.set_state(SAVED)
