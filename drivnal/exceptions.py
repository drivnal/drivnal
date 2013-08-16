class SnapshotError(Exception):
    pass

class SnapshotPermissionError(SnapshotError):
    pass

class SnapshotAlreadyRunning(SnapshotError):
    pass

class SnapshotPathExists(SnapshotError):
    pass
