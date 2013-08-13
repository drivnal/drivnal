from distutils.core import setup

setup(
    name='drivnal',
    version='0.1.1',
    description='Linux backup utility with web interface',
    author='Zachary Huff',
    author_email='zach.huff.386@gmail.com',
    url='http://drivnal.com/',
    keywords='backup, snapshot, web interface, rsync',
    packages=['drivnal', 'drivnal.handlers'],
    license='AGPL3',
    data_files=[
        ('/etc', ['data/etc/drivnal.conf']),
        ('/etc/systemd/system', ['data/systemd/drivnal.service']),
        ('/var/lib/drivnal', ['data/var/drivnal.db']),
        ('/var/log', ['data/var/log/drivnal.log']),
        ('/usr/share/drivnal/www', ['www/dist/favicon.ico']),
        ('/usr/share/drivnal/www', ['www/dist/index.html']),
        ('/usr/share/drivnal/www', ['www/dist/robots.txt']),
        ('/usr/share/drivnal/www/css', ['www/dist/css/main.css']),
        ('/usr/share/drivnal/www/js', ['www/dist/js/main.js']),
        ('/usr/share/drivnal/www/js', ['www/dist/js/require.min.js']),
        ('bin', ['data/bin/drivnal']),
    ],
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
