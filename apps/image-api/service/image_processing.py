import base64
import pickle
from datetime import datetime

from image_finder import ImageFinder


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
    finder = ImageFinder(image=image_input)
    image_coop = finder.find_image_in_screen(template=template_input, threshold=0.7)
    return image_coop


def __draw_point_on_image(image_input, x, y):
    """
    This function draws a point on an image at the coordinates.
    private function for internal use only.

    Parameters:
    image_input (bytes): The input image in bytes.
    x (int): The x-coordinate of the point.
    y (int): The y-coordinate of the point.

    Returns:
    ndarray: The image with the point drawn.
    """
    finder = ImageFinder(image=image_input)
    return_image = finder.draw_point(x=x, y=y, color=(0, 0, 255), thickness=-1, radius=50)
    return return_image


def __draw_rectangle_on_image(image_input, top_left_x, top_left_y, bottom_right_x, bottom_right_y):
    """
    This function draws a rectangle on an image with the specified coordinates.
    private function for internal use only.

    Parameters:
    image_input (bytes): The input image in bytes.
    top_left (tuple): The coordinates of the top left corner of the rectangle.
    bottom_right (tuple): The coordinates of the bottom right corner of the rectangle.

    Returns:
    ndarray: The image with the rectangle drawn.
    """
    finder = ImageFinder(image=image_input)
    return_image = finder.draw_rectangle(top_left_x=top_left_x, top_left_y=top_left_y,
                                         bottom_right_x=bottom_right_x, bottom_right_y=bottom_right_y,
                                         color=(0, 0, 255), thickness=2)
    return return_image


def extract_texts_in_rectangle(image_input, top_left, bottom_right):
    """
    extracts the texts that are inside a specified rectangle.

    Parameters:
    json_data (dict):
    top_left (tuple):
    bottom_right (tuple):

    Returns:
    list: A list of texts that are inside the specified rectangle.
    """
    finder = ImageFinder(image=image_input)
    texts_in_rectangle = finder.find_text_in_rectangle(top_left_x=top_left[0], top_left_y=top_left[1],
                                                       bottom_right_x=bottom_right[0], bottom_right_y=bottom_right[1],
                                                       lang=['ko', 'en'])
    return_image = finder.draw_rectangle(top_left_x=top_left[0], top_left_y=top_left[1],
                                         bottom_right_x=bottom_right[0], bottom_right_y=bottom_right[1],
                                         color=(0, 255, 0), thickness=3)
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        import os
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        api_data_path = os.path.join(root_dir, 'api_data.pkl')
        with open(api_data_path, 'rb') as f:
            api_data = pickle.load(f)
    except (FileNotFoundError, EOFError):
        api_data = {}
    result_base64 = base64.b64encode(return_image).decode('utf-8')

    if timestamp not in api_data:
        api_data[timestamp] = []
    api_data[timestamp].append({
        'response': texts_in_rectangle,
        'image': result_base64
    })

    with open(api_data_path, 'wb') as f:
        pickle.dump(api_data, f)
    return texts_in_rectangle

# if __name__ == '__main__':
#     with open('../tests/test_image.png', 'rb') as f:
#         image_input = f.read()
#     byte_image = __draw_point_on_image(image_input=image_input, x=806, y=595)
#     with open('test.png', 'wb') as f:
#         f.write(byte_image)
#     byte_image = __draw_rectangle_on_image(image_input=image_input, top_left_x=0, top_left_y=1700,
#                                            bottom_right_x=1000, bottom_right_y=2000)
#     with open('test_rectangle.png', 'wb') as f:
#         f.write(byte_image)
