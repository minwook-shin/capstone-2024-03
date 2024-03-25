import tempfile

import cv2
from flask import Blueprint, request, jsonify, send_file
from werkzeug.datastructures import FileStorage

from service.image_processing import find_matches, draw_point_on_image

ProcessImage = Blueprint('image processing', __name__)


@ProcessImage.route('/')
def hello_world():
    return {"message": "ProcessImage is running."}


@ProcessImage.route('/process', methods=['POST'])
def process_image():
    """
    Process an image and return the x, y coordinates of the processed part.
    ---
    parameters:
      - in: formData
        name: image
        type: file
        description: The image to process
      - in: formData
        name: template
        type: file
        description: The template image to match
    responses:
      200:
        description: Return the x, y coordinates of the processed part of the image
        content:
          application/json:
            schema:
              type: object
              properties:
                matches:
                  type: array
                  items:
                    type: object
                    properties:
                      x:
                        type: integer
                        description: The x coordinate of the processed part of the image
                      y:
                        type: integer
                        description: The y coordinate of the processed part of the image
                      score:
                        type: number
                        description: The matching score
    """
    image_file: FileStorage = request.files['image']
    template_file: FileStorage = request.files['template']
    image_bytes = image_file.read()
    template_bytes = template_file.read()
    result = find_matches(image_bytes, template_bytes)
    return jsonify(result)


@ProcessImage.route('/draw_point', methods=['POST'])
def draw_point_route():
    """
    Draw a point on an image and return the image.
    ---
    parameters:
      - in: formData
        name: image
        type: file
        required: true
        description: The image to draw a point on
      - in: formData
        name: x
        type: integer
        required: true
        description: The x coordinate of the point
      - in: formData
        name: y
        type: integer
        required: true
        description: The y coordinate of the point
    responses:
      200:
        description: Return the image with the point drawn
        content:
          image/png:
            schema:
              type: string
              format: binary
    """
    image_file: FileStorage = request.files['image']
    x = int(request.form['x'])
    y = int(request.form['y'])
    image_bytes = image_file.read()
    result_image = draw_point_on_image(image_bytes, x, y)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
    cv2.imwrite(temp_file.name, result_image)

    return send_file(temp_file.name, mimetype='image/png')
