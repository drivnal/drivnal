from setuptools import setup
import os
import sys
import copy
import shlex
import shutil
import fileinput
import drivnal

PATCH_DIR = 'build'
INSTALL_UPSTART = True
INSTALL_SYSTEMD = True

prefix = sys.prefix
for arg in copy.copy(sys.argv):
    if arg.startswith('--prefix'):
        prefix = os.path.normpath(shlex.split(arg)[0].split('=')[-1])
    elif arg == '--no-upstart':
        sys.argv.remove('--no-upstart')
        INSTALL_UPSTART = False
    elif arg == '--no-systemd':
        sys.argv.remove('--no-systemd')
        INSTALL_SYSTEMD = False

if not os.path.exists('build'):
    os.mkdir('build')

data_files = [
    ('/etc', ['data/etc/drivnal.conf']),
    ('/var/log', ['data/var/log/drivnal.log']),
    ('/usr/share/drivnal/www', ['www/dist/favicon.ico']),
    ('/usr/share/drivnal/www', ['www/dist/index.html']),
    ('/usr/share/drivnal/www', ['www/dist/robots.txt']),
    ('/usr/share/drivnal/www/css', ['www/dist/css/main.css']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/main.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/require.min.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-coffee.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-css.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-javascript.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-json.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-lua.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-php.js']),
    ('/usr/share/drivnal/www/js', ['www/dist/js/worker-xquery.js']),
]

patch_files = []
if INSTALL_UPSTART:
    patch_files.append('%s/drivnal.conf' % PATCH_DIR)
    data_files.append(('/etc/init', ['%s/drivnal.conf' % PATCH_DIR]))
    shutil.copy('data/init/drivnal.conf', '%s/drivnal.conf' % PATCH_DIR)
if INSTALL_SYSTEMD:
    patch_files.append('%s/drivnal.service' % PATCH_DIR)
    data_files.append(('/etc/systemd/system',
        ['%s/drivnal.service' % PATCH_DIR]))
    shutil.copy('data/systemd/drivnal.service',
        '%s/drivnal.service' % PATCH_DIR)

for file_name in patch_files:
    for line in fileinput.input(file_name, inplace=True):
        line = line.replace('%PREFIX%', prefix)
        print line.rstrip('\n')

setup(
    name='drivnal',
    version=drivnal.__version__,
    description='Simple snapshot backups',
    long_description=open('README.rst').read(),
    author='Zachary Huff',
    author_email='zach.huff.386@gmail.com',
    url='http://drivnal.com/',
    download_url='https://github.com/drivnal/drivnal/archive/%s.tar.gz' % (
        drivnal.__version__),
    keywords='backup, snapshot, web interface, rsync',
    packages=['drivnal', 'drivnal.handlers'],
    license=open('LICENSE').read(),
    zip_safe=False,
    install_requires=[
        'flask>=0.6',
        'cherrypy>=3.2.0',
    ],
    data_files=data_files,
    entry_points={
        'console_scripts': ['drivnal = drivnal.__main__:drivnal_daemon'],
    },
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Natural Language :: English',
        'Operating System :: POSIX :: Linux',
        'Programming Language :: Python :: 2.7',
        'Topic :: System :: Archiving :: Backup',
    ],
)
