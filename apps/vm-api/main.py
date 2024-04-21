"""
variable manager api
"""
from flasgger import Swagger
from flask import Flask
from flask_variable_manager import VariableManagerExtension

vm = VariableManagerExtension()
app = Flask(__name__)
vm.init_app(app)
template = {
  "swagger": "2.0",
  "info": {
    "title": "Variable API",
    "description": "변수 매니저 & 파이썬 스크립트 API",
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
