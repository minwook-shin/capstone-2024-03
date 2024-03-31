import unittest
from unittest.mock import patch

import cv2
import numpy as np

from service.image_processing import extract_texts_in_rectangle, find_matches


class TestImageProcessingTextFunctions(unittest.TestCase):
    def setUp(self):
        # Create a black image and a smaller white template
        self.image = cv2.imencode(".png", np.zeros((100, 100), dtype=np.uint8))[1].tobytes()
        self.template = cv2.imencode(".png", 255 * np.ones((50, 50), dtype=np.uint8))[1].tobytes()

    def test_find_image_in_screen_with_existing_template(self):
        result = find_matches(self.image, self.template)
        self.assertEqual(result["x"], 0)
        self.assertEqual(result["y"], 0)
        self.assertEqual(result["center_x"], 25)
        self.assertEqual(result["center_y"], 25)
        self.assertEqual(result["score"], 1.0)

    @patch('easyocr.Reader')
    def test_find_text_in_rectangle_happy_path(self, mock_reader):
        mock_reader.return_value.readtext.return_value = [
            ([(10, 10), (20, 10), (20, 20), (10, 20)], 'text1', 0.9),
            ([(30, 30), (40, 30), (40, 40), (30, 40)], 'text2', 0.9)
        ]
        result = extract_texts_in_rectangle(image_input=b'sample_image_data', top_left=(0, 0), bottom_right=(50, 50))
        self.assertEqual(result, ['text1', 'text2'])

    @patch('easyocr.Reader')
    def test_find_text_in_rectangle_no_text_in_rectangle(self, mock_reader):
        mock_reader.return_value.readtext.return_value = [
            ([(60, 60), (70, 60), (70, 70), (60, 70)], 'text1', 0.9),
            ([(80, 80), (90, 80), (90, 90), (80, 90)], 'text2', 0.9)
        ]
        result = extract_texts_in_rectangle(image_input=b'sample_image_data', top_left=(0, 0), bottom_right=(50, 50))
        self.assertEqual(result, [])

    @patch('easyocr.Reader')
    def test_find_text_in_rectangle_partial_text_in_rectangle(self, mock_reader):
        mock_reader.return_value.readtext.return_value = [
            ([(10, 10), (20, 10), (20, 20), (10, 20)], 'text1', 0.9),
            ([(80, 80), (90, 80), (90, 90), (80, 90)], 'text2', 0.9)
        ]
        result = extract_texts_in_rectangle(image_input=b'sample_image_data', top_left=(0, 0), bottom_right=(50, 50))
        self.assertEqual(result, ['text1'])
