VERSION='0.1.12'

mkdir -p ../build/pip
cd ../build/pip

wget https://github.com/drivnal/drivnal/archive/$VERSION.tar.gz

mv $VERSION.tar.gz drivnal-$VERSION.tar.gz

cd ../../

python2 setup.py register

echo 'MD5: '`md5sum ./build/pip/drivnal-$VERSION.tar.gz | cut -d' ' -f1`
echo 'UPLOAD: ../build/pip/drivnal-'$VERSION'.tar.gz'

