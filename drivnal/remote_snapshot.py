from constants import *
from core_snapshot import CoreSnapshot
import logging

logger = logging.getLogger(APP_NAME)

class RemoteSnapshot(CoreSnapshot):
    def _get_path(self):
        return ''

    def _get_log_path(self):
        return ''

    def setup_snapshot(self):
        pass

    def setup_hard_links(self, last_snapshot):
        pass

    def set_state(self, state):
        if self.state == state:
            return
        self.state = state
