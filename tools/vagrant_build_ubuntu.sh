VERSION="0.1.9"

gpg --import private_key.asc

mkdir -p /vagrant/build/debian
cd /vagrant/build/debian

wget https://github.com/drivnal/drivnal/archive/$VERSION.tar.gz

tar xfz $VERSION.tar.gz
rm -rf drivnal-$VERSION/debian
tar cfz drivnal_$VERSION.orig.tar.gz drivnal-$VERSION
rm -rf drivnal-$VERSION

tar xfz $VERSION.tar.gz
cd drivnal-$VERSION

debuild -S
sed -i -e 's/0ubuntu1/0ubuntu2/g' debian/changelog
debuild -S

cd ..

dput ppa:drivnal/ppa/ubuntu/lucid drivnal_$VERSION-0ubuntu1_source.changes
dput ppa:drivnal/ppa/ubuntu/raring drivnal_$VERSION-0ubuntu2_source.changes
