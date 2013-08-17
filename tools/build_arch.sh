VERSION="0.1.8"

mkdir -p ../build/arch_linux
cd ../build/arch_linux

wget https://github.com/drivnal/drivnal/archive/$VERSION.tar.gz

cp ../../PKGBUILD ./

TAR_SHA256=$(sha256sum $VERSION.tar.gz | cut -d' ' -f1)
sed -i -e 's/CHANGE_ME/'$TAR_SHA256'/g' PKGBUILD

makepkg --source