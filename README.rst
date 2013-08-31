Drivnal: Simple snapshot backups
================================

.. image:: https://pypip.in/v/drivnal/badge.png
    :target: https://crate.io/packages/drivnal

.. image:: https://pypip.in/d/drivnal/badge.png
    :target: https://crate.io/packages/drivnal

`Drivnal <https://github.com/drivnal/drivnal>`_ is a backup utility created
using rsync with a web interface to manage volumes, snapshots and restore
files. Similar to Time Machine all snapshots store only the changed files from
the previous snapshot and hard links are created for unchanged files. Unchanged
files are never stored more then once on the snapshot volume. All snapshots
are independent of the other snapshots and previous snapshots are not required
to restore files from a snapshot. For more information on how this works read
the `hard links <https://github.com/drivnal/drivnal/wiki/Hard-Links>`_ wiki
page.

Development
-----------

A python script ``server.py`` is included in the root directory to run the
server from the root dir. The server will use the unbuilt web files,
modification to the server will be automatically reloaded. Vagrant can also be
used to safely develop in a virtualized environment, testing the webapp with
vagrant will not modify the host system. When developing with vagrant the root
directory will automatically sync to the guest system at ``/vagrant`` and the
port 6500 will be forwarded to allow access to the webapp on host system. The
vagrant setup will also setup collectd to monitor performance of guest system.
Vagrant ``stress`` vm is used for stress testing performance with eight backup
volumes.

Development Setup
-----------------

.. code-block:: bash

    $ git clone https://github.com/drivnal/drivnal.git
    $ cd drivnal
    $ python2 server.py
    # Open http://localhost:6500/

Vagrant Setup
-------------

.. code-block:: bash

    $ git clone https://github.com/drivnal/drivnal.git
    $ cd drivnal
    $ vagrant up testing
    $ vagrant ssh testing
    $ sudo drivnal
    # Open http://localhost:6500/
    # Open http://localhost:8080/collectd

JavaScript Development
----------------------

To build the webapp the node package manager is required. First install the
required node modules then run the available build commands.

.. code-block:: bash

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
