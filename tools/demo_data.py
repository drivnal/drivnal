"""Generate demo data for webapp demo."""
import os
import pprint
import urllib
import mimetypes

objects = []
mime = mimetypes.MimeTypes()

def add_dir(cur_objects, dir_path):
    for dir_name in dir_path.split(os.sep):
        if not dir_name:
            continue

        object_exists = False
        for obj in cur_objects:
            if obj['id'] == dir_name:
                object_exists = True
                cur_objects = obj['objects']
                break

        if not object_exists:
            obj = {
                'id': dir_name,
                'size': None,
                'time': None,
                'type': 'inode/directory',
                'objects': [],
            }
            cur_objects.append(obj)
            cur_objects = obj['objects']

    return cur_objects

def add_path(path):
    dir_paths = []
    dir_paths_dir_names = {}
    dir_paths_file_names = {}

    for (dir_path, dir_names, file_names) in os.walk(path):
        dir_paths.append(dir_path)
        dir_paths_dir_names[dir_path] = dir_names
        dir_paths_file_names[dir_path] = file_names

    for dir_path in sorted(dir_paths):
        cur_objects = add_dir(objects, dir_path)
        dir_names = dir_paths_dir_names[dir_path]
        file_names = dir_paths_file_names[dir_path]

        for dir_name in sorted(dir_names):
            path = os.path.join(dir_path, dir_name)

            object_exists = False
            for obj in cur_objects:
                if obj['id'] == dir_name:
                    object_exists = True
                    break

            if not object_exists:
                obj = {
                    'id': dir_name,
                    'size': None,
                    'time': None,
                    'type': 'inode/directory',
                    'objects': [],
                }
                cur_objects.append(obj)

        for file_name in sorted(file_names):
            path = os.path.join(dir_path, file_name)

            object_exists = False
            for obj in cur_objects:
                if obj['id'] == file_name:
                    object_exists = True
                    break

            if not object_exists:
                try:
                    stat = os.stat(path)
                    size = stat.st_size
                    time = int(stat.st_mtime)
                except OSError:
                    size = None
                    time = None
                obj = {
                    'id': file_name,
                    'size': size,
                    'time': time,
                    'type': mime.guess_type(urllib.pathname2url(path))[0]
                }
                cur_objects.append(obj)

add_path('/home/ubuntu')

#pprint.pprint(objects, indent=0)
print ('%s' % objects).replace(': None', ': null')
