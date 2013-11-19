VERSION=`cat ../drivnal/__init__.py | grep __version__ | cut -d\' -f2`

gpg --import private_key.asc

mkdir -p /vagrant/build/debian_test
cd /vagrant/build/debian_test

wget https://github.com/drivnal/drivnal/archive/master.tar.gz

tar xfz master.tar.gz
mv drivnal-master drivnal-$VERSION
tar cfz $VERSION.tar.gz drivnal-$VERSION

tar xfz $VERSION.tar.gz
rm -rf drivnal-$VERSION/debian
tar cfz drivnal_$VERSION.orig.tar.gz drivnal-$VERSION
rm -rf drivnal-$VERSION

tar xfz $VERSION.tar.gz
cd drivnal-$VERSION

debuild
