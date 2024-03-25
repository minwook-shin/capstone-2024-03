import cv2
import numpy as np


# https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html
def find_matches(image_input, template_input):
    """
    This function finds matches of a template in an image using template matching.

    Parameters:
    image_input (bytes): The input image in bytes.
    template_input (bytes): The template image in bytes.

    Returns:
    dict: A dictionary containing the coordinates of the top left corner of the match,
          the coordinates of the center of the match, and the match score.
    """
    # Convert the image bytes to grayscale
    npimg = np.fromstring(image_input, np.uint8)
    img_rgb = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
    # Convert the template bytes to image
    npimg = np.fromstring(template_input, np.uint8)
    template = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
    # Get the width and height of the template
    w, h = template.shape[::-1]
    # template matching
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
    # minimum and maximum values and their locations
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    # top left corner of the match
    top_left = max_loc
    # bottom right corner of the match
    bottom_right = (top_left[0] + w, top_left[1] + h)
    center = ((top_left[0] + bottom_right[0]) // 2, (top_left[1] + bottom_right[1]) // 2)
    return {"x": top_left[0], "y": top_left[1], "center_x": center[0], "center_y": center[1], "score": max_val}


def draw_point_on_image(image_input, x, y):
    """
    This function draws a point on an image at the coordinates.

    Parameters:
    image_input (bytes): The input image in bytes.
    x (int): The x-coordinate of the point.
    y (int): The y-coordinate of the point.

    Returns:
    ndarray: The image with the point drawn.
    """
    # Convert the image bytes to image
    npimg = np.fromstring(image_input, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    # Draw a circle at the coordinates
    cv2.circle(img, (x, y), radius=50, color=(0, 0, 255), thickness=-1)
    return img
