VERSION=`cat ../drivnal/__init__.py | grep __version__ | cut -d\' -f2`

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

echo '\n\nRUN COMMANDS BELOW TO UPLOAD:'
echo 'sudo dput ppa:drivnal/ppa/ubuntu/precise ../build/debian/drivnal_'$VERSION'-0ubuntu1_source.changes'
echo 'sudo dput ppa:drivnal/ppa/ubuntu/raring ../build/debian/drivnal_'$VERSION'-0ubuntu2_source.changes'
