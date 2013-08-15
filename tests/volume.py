import unittest
import requests
import json
import time

URL = 'http://localhost:6500'
HEADERS = {
    'Content-type': 'application/json',
    'Accept': 'application/json',
}

class Volume(unittest.TestCase):
    def setUp(self):
        # Start vagrant
        pass

    def test_vagrant_data(self):
        #######################################################################
        # Get volume
        #######################################################################
        response = requests.get('%s/volume' % URL, headers=HEADERS)
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], 'af9d03d0038d11e38d68080027880ca6')
        self.assertEqual(data[0]['name'], 'Root Backup')
        self.assertEqual(data[0]['source_path'], '/')
        self.assertEqual(data[0]['path'], '/media/backup')
        self.assertEqual(data[0]['excludes'], ['vagrant'])
        self.assertEqual(data[0]['schedule'], '1day')
        self.assertEqual(data[0]['min_free_space'], 0.1)
        self.assertEqual(data[0]['bandwidth_limit'], 0)
        self.assertTrue(isinstance(data[0]['percent_used'], float))

    def test_volume_get_post_put_delete(self):
        #######################################################################
        # Create volume
        #######################################################################
        data = {
            'name': 'Unittest Volume',
            'source_path': '/',
            'path': '/tmp',
            'excludes': ['vagrant'],
            'schedule': '3days',
            'min_free_space': 0.2,
            'bandwidth_limit': 0,
        }
        response = requests.post('%s/volume' % URL, headers=HEADERS,
            data=json.dumps(data))
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})

        #######################################################################
        # Get volume
        #######################################################################
        response = requests.get('%s/volume' % URL, headers=HEADERS)
        data = response.json()

        self.assertEqual(response.status_code, 200)

        volume_id = None
        for volume in data:
            if volume['name'] == 'Unittest Volume':
                volume = volume
                volume_id = volume['id']
                break

        self.assertIsNotNone(volume_id)
        self.assertEqual(volume['name'], 'Unittest Volume')
        self.assertEqual(volume['source_path'], '/')
        self.assertEqual(volume['path'], '/tmp')
        self.assertEqual(volume['excludes'], ['vagrant'])
        self.assertEqual(volume['schedule'], '3days')
        self.assertEqual(volume['min_free_space'], 0.2)
        self.assertEqual(volume['bandwidth_limit'], 0)
        self.assertTrue(isinstance(volume['percent_used'], float))

        #######################################################################
        # Modify volume
        #######################################################################
        data = {
            'name': 'Unittest Volume 2',
            'source_path': '/home',
            'path': '/media',
            'excludes': ['vagrant', 'lost+found'],
            'schedule': '1day',
            'min_free_space': 0.4,
            'bandwidth_limit': 10240,
        }
        response = requests.put('%s/volume/%s' % (URL, volume_id),
            headers=HEADERS, data=json.dumps(data))
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})

        # Wait for volume move task to finish
        time.sleep(1)

        #######################################################################
        # Get volume
        #######################################################################
        response = requests.get('%s/volume' % URL, headers=HEADERS)
        data = response.json()

        self.assertEqual(response.status_code, 200)

        volume = None
        for volume in data:
            if volume['id'] == volume_id:
                volume = volume
                break

        self.assertIsNotNone(volume)
        self.assertEqual(volume['id'], volume_id)
        self.assertEqual(volume['name'], 'Unittest Volume 2')
        self.assertEqual(volume['source_path'], '/home')
        self.assertEqual(volume['path'], '/media')
        self.assertEqual(volume['excludes'], ['vagrant', 'lost+found'])
        self.assertEqual(volume['schedule'], '1day')
        self.assertEqual(volume['min_free_space'], 0.4)
        self.assertEqual(volume['bandwidth_limit'], 10240)
        self.assertTrue(isinstance(volume['percent_used'], float))

        #######################################################################
        # Delete volume
        #######################################################################
        response = requests.delete('%s/volume/%s' % (URL, volume['id']),
            headers=HEADERS)
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})

if __name__ == '__main__':
    unittest.main()
