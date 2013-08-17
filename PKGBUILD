# Maintainer: Zachary Huff <zach.huff.386@gmail.com>

pkgname=drivnal
pkgver=0.1.9
pkgrel=1
pkgdesc="Linux backup utility with web interface"
arch=("any")
license=("AGPL3")
url="https://github.com/${pkgname}/${pkgname}"
depends=(
    "python2"
    "python2-flask"
    "python2-cherrypy"
    "rsync"
)
makedepends=(
    "python2-distribute"
)
provides=("${pkgname}")
conflicts=("${pkgname}")
source=("${url}/archive/${pkgver}.tar.gz")
sha256sums=("CHANGE_ME")
backup=(
    "etc/${pkgname}.conf"
    "var/lib/${pkgname}/${pkgname}.db"
    "var/log/${pkgname}.log"
)

build() {
    cd "${srcdir}/${pkgname}-${pkgver}"
    python2 setup.py build
}

package() {
    cd "${srcdir}/${pkgname}-${pkgver}"
    python2 setup.py install --root="${pkgdir}" --prefix=/usr --no-upstart
}