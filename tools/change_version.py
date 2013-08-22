"""Change version."""
import fileinput
import sys

VERSION = sys.argv[1]

for line in fileinput.input('../PKGBUILD', inplace=True):
    if 'pkgver=' in line:
        line = 'pkgver=%s' % VERSION
    print line.rstrip('\n')

for line in fileinput.input('../setup.py', inplace=True):
    if 'VERSION = ' in line:
        line = 'VERSION = \'%s\'' % VERSION
    print line.rstrip('\n')

for file_path in ['build_pip.sh', 'build_arch.sh', 'vagrant_build_ubuntu.sh']:
    for line in fileinput.input(file_path, inplace=True):
        if 'VERSION=' in line:
            line = 'VERSION=\'%s\'' % VERSION
        print line.rstrip('\n')

for line in fileinput.input('../debian/changelog', inplace=True):
    if 'drivnal (' in line:
        line = 'drivnal (%s-0ubuntu1) unstable; urgency=low' % VERSION
    print line.rstrip('\n')
