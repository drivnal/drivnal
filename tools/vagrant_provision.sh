#!/usr/bin/env bash
apt-get update -qq 1> /dev/null

# Dev requirements
apt-get install -qq -y python-flask python-cherrypy3 python-objgraph htop 1> /dev/null

# Build requirements
apt-get install -qq -y devscripts debhelper python-all python-setuptools 1> /dev/null

# Collectd
apt-get install -qq -y collectd apache2 librrds-perl libconfig-general-perl libregexp-common-perl 1> /dev/null

mkdir -p /media/backup
mkdir -p /var/lib/drivnal

cp /vagrant/tools/vagrant_dput.cf /etc/dput.cf
cp /vagrant/tools/vagrant_collection3.conf /etc/apache2/conf.d/collection3.conf

service apache2 restart 1> /dev/null

cp /vagrant/tools/vagrant_drivnal.py /usr/bin/drivnal
cp -n /vagrant/tools/vagrant_drivnal.db /var/lib/drivnal/drivnal.db
cp -n /vagrant/tools/vagrant_volume.conf /media/backup/drivnal.conf
chmod +x /usr/bin/drivnal
