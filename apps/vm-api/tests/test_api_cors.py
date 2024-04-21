# pylint:disable=duplicate-code
"""
test api cors
"""
import unittest
from flask import Flask
from main import add_cors_headers
from werkzeug.wrappers import Response


class TestVmMain(unittest.TestCase):
    """
    Test the main functions of the vm-api.
    """
    def setUp(self):
        self.app = Flask(__name__)

    def test_add_cors_headers_for_vm(self):
        """
        This test case verifies that the add_cors_headers function correctly.
        """
        with self.app.test_request_context():
            response = Response()
            response = add_cors_headers(response)
            self.assertEqual(
                response.headers['Access-Control-Allow-Methods'],
                'GET, POST')
            self.assertEqual(
                response.headers['Access-Control-Allow-Origin'],
                'http://127.0.0.1:3000')
            self.assertEqual(
                response.headers['Access-Control-Allow-Headers'],
                'Content-Type')


if __name__ == '__main__':
    unittest.main()
