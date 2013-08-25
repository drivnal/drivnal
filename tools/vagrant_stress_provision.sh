#!/usr/bin/env bash
cp /vagrant/tools/vagrant_stress_drivnal.db /var/lib/drivnal/drivnal.db

for i in 1 2 3 4 5 6 7 8
do
    mkdir -p /media/volumes/backup$i
    cp -n /vagrant/tools/vagrant_stress_volume.conf /media/volumes/backup$i/drivnal.conf
    sed -i s/%NUM%/$i/g /media/volumes/backup$i/drivnal.conf
done
