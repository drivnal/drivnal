# Drivnal
[![Downloads](https://pypip.in/v/drivnal/badge.png)](https://crate.io/package/drivnal) [![Downloads](https://pypip.in/d/drivnal/badge.png)](https://crate.io/package/drivnal)

[Drivnal](https://github.com/drivnal/drivnal) is a backup utility created using rsync with a web interface to manage volumes, snapshots and restore files. Similar to Time Machine all snapshots store only the changed files from the previous snapshot and hard links are created for unchanged files. Unchanged files are never stored more then once on the snapshot volume. All snapshots are independent of the other snapshots and previous snapshots are not required to restore files from a snapshot. For more information on how this works read the [hard links](//github.com/drivnal/drivnal/wiki/Hard-Links) page.

## Development
A python script `server.py` is included in the root directory to run the server from the root dir. The server will use the unbuilt web files, modification to the server will be automatically reloaded. Vagrant can also be used to safely develop in a virtualized environment, testing the webapp with vagrant will not modify the host system. When developing with vagrant the root directory will automatically sync to the guest system at `/vagrant` and the port 6500 will be forwarded to allow access to the webapp on host system.

### Development Setup
```
$ git clone https://github.com/drivnal/drivnal.git
$ cd drivnal
$ python2 server.py
Open http://localhost:6500/
```

### Vagrant Setup
```
$ git clone https://github.com/drivnal/drivnal.git
$ cd drivnal
$ vagrant up
$ vagrant ssh
$ sudo drivnal
Open http://localhost:6500/
```

### JavaScript Development
To build the webapp the node package manager is required. First install the required node modules then run the available build commands.

```
$ cd www
$ npm install
# Run jshint and build production dist
$ grunt
# Run jshint and build production dist with source maps
$ grunt testing
# Run jshint and build demo dist
$ grunt demo
# Run jshint
$ grunt lint
# Update javascript plugins
$ grunt update
```

-------------------------------------------------------------------------------

Copyright (c) 2013 Zachary Huff

Drivnal is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Drivnal is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Drivnal. If not, see <http://www.gnu.org/licenses/>.
