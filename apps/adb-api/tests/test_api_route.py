import unittest
from unittest.mock import patch
from flask import Flask
from blueprints.control import controller, ADB


class TestController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(controller)
        self.client = self.app.test_client()

    @patch.object(ADB, 'is_adb_enabled')
    def test_adb_status_returns_correctly(self, mock_is_adb_enabled):
        """
        Test case for checking the ADB status.
        This test case mocks the 'is_adb_enabled' method of the ADB class and sets its return value to True.
        """
        mock_is_adb_enabled.return_value = True
        response = self.client.get('/')
        self.assertEqual(response.json["ADB status"], True)

    @patch.object(ADB, 'is_adb_enabled')
    def test_adb_status_returns_false(self, mock_is_adb_enabled):
        """
        Test case for checking the ADB status.
        This test case mocks the 'is_adb_enabled' method of the ADB class and sets its return value to False.
        """
        mock_is_adb_enabled.return_value = False
        response = self.client.get('/')
        self.assertEqual(response.json["ADB status"], False)

    def test_scroll_up_adds_task(self):
        """
        Test case for the scroll up route.
        This test case sends a POST request to the '/scroll_up' route with a JSON payload.
        """
        response = self.client.post('/scroll_up', json={'time': 1, 'task_id': 'task1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'scroll_up added', 'time': 1})

    def test_scroll_down_adds_task(self):
        """
        Test case for the scroll down route.
        This test case sends a POST request to the '/scroll_down' route with a JSON payload.
        """
        response = self.client.post('/scroll_down', json={'time': 1, 'task_id': 'task1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'scroll_down added', 'time': 1})

    def test_single_click_adds_task(self):
        """
        Test case for the single click route.
        This test case sends a POST request to the '/single_click' route with a JSON payload.
        """
        response = self.client.post('/single_click', json={'x': 100, 'y': 200, 'time': 1, 'task_id': 'task1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'single_click added', 'x': 100, 'y': 200, 'time': 1})

    def test_short_cut_adds_task(self):
        """
        Test case for the shortcut route.
        This test case sends a POST request to the '/short_cut' route with a JSON payload.
        """
        response = self.client.post('/short_cut', json={'key_event': "keyevent 1", 'task_id': 'task1', 'time': 1})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'short_cut added', 'key_event':  "keyevent 1", 'time': 1})

    def test_iterate_adds_task(self):
        """
        Test case for the iterate route.
        This test case sends a POST request to the '/iteration' route with a JSON payload.
        """
        response = self.client.post('/iteration', json={'time': 1, 'task_id': 'task1', 'functions': '[]'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'function added', 'iterations': 1, 'function': []})

    def test_input_text_adds_task(self):
        """
        Test case for the input text route.
        This test case sends a POST request to the '/input_text' route with a JSON payload.
        """
        response = self.client.post('/input_text', json={'input_text': "Hello", 'task_id': 'task1', 'time': 1})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'input_text added', 'text': "Hello", 'time': 1})

    def test_execute_adb_returns_no_tasks(self):
        """
        Test case for the execute ADB operator route when there are no tasks.
        This test case sends a GET request to the '/run' route.
        """
        self.client.delete('/clear')
        response = self.client.get('/run')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'No operators to execute'})

    def test_operator_clears_tasks(self):
        """
        Test case for the clear ADB operator route.
        This test case sends a DELETE request to the '/clear' route.
        """
        response = self.client.delete('/clear')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'All operators cleared'})

    def test_get_all_operator(self):
        """
        Test case for the get all ADB operator tasks route.
        This test case sends a GET request to the '/tasks' route.
        """
        response = self.client.get('/tasks')
        self.assertEqual(response.status_code, 200)
        self.assertIn('ordered_tasks', response.json)
        self.assertIn('tasks', response.json)

    def test_delay_adds_task(self):
        """
        Test case for the delay route.
        This test case sends a POST request to the '/delay' route with a JSON payload.
        """
        response = self.client.post('/delay', json={'time': 1, 'task_id': 'task1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'message': 'delay added', 'time': 1})


if __name__ == '__main__':
    unittest.main()
