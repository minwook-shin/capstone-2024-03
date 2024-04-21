# pylint:disable=duplicate-code
"""
test image processing main
"""
import unittest
from flask import Flask
from main import add_cors_headers
from werkzeug.wrappers import Response


class TestImageMain(unittest.TestCase):
    """
    Test the main functions of the image-api.
    """
    def setUp(self):
        self.app = Flask(__name__)

    def test_add_cors_headers_for_image(self):
        """
        verifies that the add_cors_headers function correctly.
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
