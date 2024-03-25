import cv2
import numpy as np


# https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html
def find_matches(image_input, template_input):
    npimg = np.fromstring(image_input, np.uint8)
    img_rgb = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)

    npimg = np.fromstring(template_input, np.uint8)
    template = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)

    w, h = template.shape[::-1]
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    top_left = max_loc
    bottom_right = (top_left[0] + w, top_left[1] + h)
    cv2.rectangle(img_rgb, top_left, bottom_right, 255, 2)
    center = ((top_left[0] + bottom_right[0]) // 2, (top_left[1] + bottom_right[1]) // 2)
    return {"x": top_left[0], "y": top_left[1], "center_x": center[0], "center_y": center[1], "score": max_val}


def draw_point_on_image(image_input, x, y):
    npimg = np.fromstring(image_input, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    cv2.circle(img, (x, y), radius=50, color=(0, 0, 255), thickness=-1)
    return img
