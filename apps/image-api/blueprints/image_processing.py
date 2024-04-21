"""
This module contains the blueprint for image processing.
"""
from flask import Blueprint, request, jsonify
from werkzeug.datastructures import FileStorage

from service.image_processing import find_matches, extract_texts_in_rectangle

ProcessImage = Blueprint('image processing', __name__)


@ProcessImage.route('/')
def hello_world():
    """
    This is a run test function.
    """
    return {"message": "ProcessImage is running."}


@ProcessImage.route('/template_matching', methods=['POST'])
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


@ProcessImage.route('/extract_texts', methods=['POST'])
def extract_texts_route():
    """
    Extract texts inside a rectangle from an image
    ---
    parameters:
      - in: formData
        name: image
        type: file
        required: true
        description: The image to extract texts
      - in: formData
        name: top_left_x
        type: integer
        required: true
        description: The x coordinate of the top left corner of the rectangle
      - in: formData
        name: top_left_y
        type: integer
        required: true
        description: The y coordinate of the top left corner of the rectangle
      - in: formData
        name: bottom_right_x
        type: integer
        required: true
        description: The x coordinate of the bottom right corner of the rectangle
      - in: formData
        name: bottom_right_y
        type: integer
        required: true
        description: The y coordinate of the bottom right corner of the rectangle
    responses:
      200:
        description: Return the texts inside the specified rectangle
        content:
          application/json:
            schema:
              type: object
              properties:
                texts:
                  type: array
                  items:
                    type: string
                    description: The text inside the specified rectangle
    """
    image_file: FileStorage = request.files['image']
    top_left_x = int(request.form['top_left_x'])
    top_left_y = int(request.form['top_left_y'])
    bottom_right_x = int(request.form['bottom_right_x'])
    bottom_right_y = int(request.form['bottom_right_y'])
    image_bytes = image_file.read()
    texts = extract_texts_in_rectangle(image_bytes, (top_left_x, top_left_y),
                                       (bottom_right_x, bottom_right_y))
    return jsonify({"texts": texts})
