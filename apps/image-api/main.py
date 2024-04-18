from flasgger import Swagger
from flask import Flask

from blueprints.image_processing import ProcessImage

app = Flask(__name__)

app.register_blueprint(ProcessImage)
template = {
  "swagger": "2.0",
  "info": {
    "title": "IMAGE API",
    "description": "이미지 처리하는 API",
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
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8888, threaded=False, processes=1)
