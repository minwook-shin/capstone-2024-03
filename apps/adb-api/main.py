from flask import Flask, request, send_file
import platform

from service.screen import get_screen_capture

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
    ip = request.args.get('ip', default="192.168.0.1")
    port = request.args.get('port', default="5555")
    get_screen_capture(ip, port, file_name=temp_file_name)
    return send_file(temp_file_name, mimetype='image/png')


if __name__ == '__main__':
    app.run(host="0.0.0.0")
