import optparse
import sys
import os
import drivnal

def drivnal_daemon():
    parser = optparse.OptionParser()
    parser.add_option('-d', '--daemon', action='store_true',
        help='Daemonize process')
    parser.add_option('-p', '--pidfile', type='string',
        help='Path to create pid file')
    parser.add_option('-c', '--conf', type='string',
        help='Path to configuration file')
    (options, args) = parser.parse_args()

    if options.daemon:
        pid = os.fork()
        if pid > 0:
            if options.pidfile:
                with open(options.pidfile, 'w') as pid_file:
                    pid_file.write('%s' % pid)
            sys.exit(0)
    else:
        print '#########################################'
        print '#        __     _                   __  #'
        print '#   ____/ /____(_)   ______  ____ _/ /  #'
        print '#  / __  / ___/ / | / / __ \\/ __ `/ /   #'
        print '# / /_/ / /  / /| |/ / / / / /_/ / /    #'
        print '# \\__,_/_/  /_/ |___/_/ /_/\\__,_/_/     #'
        print '#                                       #'
        print '#########################################'

    if options.conf:
        conf_path = options.conf
    else:
        conf_path = '/etc/drivnal.conf'

    drivnal.server.conf_path = conf_path
    drivnal.server.run_all()
