#!/usr/bin/python2
import os
import sys

sys.path.append('/vagrant')
os.chdir('/vagrant')

import drivnal

print '#########################################'
print '#        __     _                   __  #'
print '#   ____/ /____(_)   ______  ____ _/ /  #'
print '#  / __  / ___/ / | / / __ \\/ __ `/ /   #'
print '# / /_/ / /  / /| |/ / / / / /_/ / /    #'
print '# \\__,_/_/  /_/ |___/_/ /_/\\__,_/_/     #'
print '#                                       #'
print '#########################################'

drivnal.server.conf_path = './tools/vagrant_drivnal.conf'
drivnal.server.run_all()
