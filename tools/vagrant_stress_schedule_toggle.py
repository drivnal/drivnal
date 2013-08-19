"""Toggle scheduling for vagrant stress testing volumes."""
import fileinput

for i in xrange(1, 9):
    file_path = '/media/volumes/backup%s/drivnal.conf' % i
    for line in fileinput.input(file_path, inplace=True):
        if 'schedule=none' in line:
            line = 'schedule=1minute'
        elif 'schedule=' in line:
            line = 'schedule=none'
        print line.rstrip('\n')
