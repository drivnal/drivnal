import threading
import unittest
import requests
import json
import time
import os

BASE_URL = os.getenv('BASE_URL', 'http://localhost:6500')
HEADERS = {
    'Accept': 'application/json',
}

_request = requests.api.request
def request(method, endpoint, **kwargs):
    headers = {
        'Accept': 'application/json',
    }
    if 'json' in kwargs and kwargs['json']:
        headers['Content-Type'] = 'application/json'
        kwargs['data'] = json.dumps(kwargs.pop('json'))
    return _request(method, BASE_URL + endpoint, headers=headers,
        verify=False, **kwargs)
requests.api.request = request


class Volume(unittest.TestCase):
    def test_vagrant_volume(self):
        response = requests.get('/volume')
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
        response = requests.post('/volume', json={
            'name': 'Unittest Volume',
            'source_path': '/',
            'path': '/tmp',
            'excludes': ['vagrant'],
            'schedule': '3days',
            'min_free_space': 0.2,
            'bandwidth_limit': 0,
        })
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})


        response = requests.get('/volume')
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


        response = requests.put('/volume/%s' % volume_id, json={
            'name': 'Unittest Volume 2',
            'source_path': '/home',
            'path': '/media',
            'excludes': ['vagrant', 'lost+found'],
            'schedule': '1day',
            'min_free_space': 0.4,
            'bandwidth_limit': 10240,
        })
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})

        # Wait for volume move task to finish
        time.sleep(1)


        response = requests.get('/volume')
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


        response = requests.delete('/volume/%s' % volume['id'])
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data, {})


if __name__ == '__main__':
    unittest.main()
