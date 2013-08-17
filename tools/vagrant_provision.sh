#!/usr/bin/env bash
apt-get update

# Dev requirements
apt-get install -y python-flask python-cherrypy3

# Build requirements
apt-get install -y devscripts debhelper python-all python-setuptools

mkdir -p /media/backup
mkdir -p /var/lib/drivnal

cp /vagrant/tools/vagrant_dput.cf /etc/dput.cf
cp /vagrant/tools/vagrant_drivnal.py /usr/bin/drivnal
cp /vagrant/tools/vagrant_drivnal.db /var/lib/drivnal/drivnal.db
cp /vagrant/tools/vagrant_volume.conf /media/backup/drivnal.conf
chmod +x /usr/bin/drivnal
