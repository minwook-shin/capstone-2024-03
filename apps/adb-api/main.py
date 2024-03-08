from flask import Flask, send_file
import platform

from service.screen import ADB

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    """Add CORS headers to the response after each request."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/python-version')
def get_python_version():
    return platform.python_version()


@app.route('/screen')
def screen():
    """
    Capture the screen of a device and return the image.

    IP and port of the device are passed as query parameters.
    """
    temp_file_name = "tmp.png"
    screen_obj = ADB()
    screen_obj.get_screen_capture(file_name=temp_file_name)
    return send_file(temp_file_name, mimetype='image/png')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888)
