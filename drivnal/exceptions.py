class SnapshotError(Exception):
    pass

class SnapshotPermissionError(SnapshotError):
    pass

class SnapshotAlreadyRunning(SnapshotError):
    pass

class SnapshotPathExists(SnapshotError):
    pass

class SnapshotSyncError(SnapshotError):
    pass

class SnapshotSpaceError(SnapshotError):
    pass

class SnapshotMoveError(SnapshotError):
    pass

class RestoreError(Exception):
    pass

class RestoreSyncError(RestoreError):
    pass
