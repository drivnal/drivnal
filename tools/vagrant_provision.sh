#!/usr/bin/env bash
apt-get update
apt-get install -y python-pip

pip install flask
pip install cherrypy

mkdir -p /media/backup
mkdir -p /var/lib/drivnal

cp /vagrant/tools/vagrant_drivnal.py /usr/bin/drivnal
cp /vagrant/tools/vagrant_drivnal.db /var/lib/drivnal/drivnal.db
cp /vagrant/tools/vagrant_volume.conf /media/backup/drivnal.conf
chmod +x /usr/bin/drivnal
