VERSION="0.1.8"

mkdir -p /vagrant/build/arch
cd /vagrant/build/arch

cp ../../$VERSION.tar.gz ./
cp ../../PKGBUILD ./

TAR_SHA256=$(sha256sum 0.1.8.tar.gz | cut -d' ' -f1)
sed -i -e 's/CHANGE_ME/'$TAR_SHA256'/g' PKGBUILD

makepkg --source
