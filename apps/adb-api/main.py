from flasgger import Swagger
from flask import Flask

from blueprints.control import controller

app = Flask(__name__)

app.register_blueprint(controller)
swagger = Swagger(app)


@app.after_request
def add_cors_headers(response):
    """Add CORS headers to the response after each request."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888, threaded=False, processes=1)
