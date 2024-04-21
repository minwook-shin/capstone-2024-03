"""
Main module of the ADB API.
"""
from flasgger import Swagger
from flask import Flask

from blueprints.control import controller
from blueprints.manage import manager

app = Flask(__name__)

app.register_blueprint(controller)
app.register_blueprint(manager)
template = {
  "swagger": "2.0",
  "info": {
    "title": "ADB API",
    "description": "ADB 서버와 연결된 API",
    "contact": {
      "responsibleOrganization": "kookmin-sw",
      "responsibleDeveloper": "minwook-shin",
      "url": "https://github.com/kookmin-sw/capstone-2024-03",
    },
    "version": "1.0.0"
  },
}
swagger = Swagger(app, template=template)


@app.after_request
def add_cors_headers(response):
    """Add CORS headers to the response after each request."""
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE'
    response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888, threaded=False, processes=1)
