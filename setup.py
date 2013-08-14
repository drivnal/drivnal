from setuptools import setup

setup(
    name='drivnal',
    version='0.1.2',
    description='Simple snapshot backups',
    author='Zachary Huff',
    author_email='zach.huff.386@gmail.com',
    url='http://drivnal.com/',
    download_url='https://github.com/drivnal/drivnal/archive/0.1.2.tar.gz',
    keywords='backup, snapshot, web interface, rsync',
    packages=['drivnal', 'drivnal.handlers'],
    license='AGPL3',
    install_requires=[
        'flask',
        'cherrypy>=3.2.0',
    ],
    data_files=[
        ('/etc', ['data/etc/drivnal.conf']),
        ('/etc/systemd/system', ['data/systemd/drivnal.service']),
        ('/etc/init', ['data/init/drivnal.conf']),
        ('/var/lib/drivnal', ['data/var/drivnal.db']),
        ('/var/log', ['data/var/log/drivnal.log']),
        ('/usr/share/drivnal/www', ['www/dist/favicon.ico']),
        ('/usr/share/drivnal/www', ['www/dist/index.html']),
        ('/usr/share/drivnal/www', ['www/dist/robots.txt']),
        ('/usr/share/drivnal/www/css', ['www/dist/css/main.css']),
        ('/usr/share/drivnal/www/js', ['www/dist/js/main.js']),
        ('/usr/share/drivnal/www/js', ['www/dist/js/require.min.js']),
    ],
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
