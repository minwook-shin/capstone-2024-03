import unittest

import numpy as np

from service.image_processing import get_text_center_coordinates, extract_texts_in_rectangle


class TestImageProcessingTextFunctions(unittest.TestCase):
    def setUp(self):
        self.json_data = {
            'text1': {'x': 50, 'y': 50},
            'text2': {'x': 150, 'y': 150},
            'text3': {'x': 250, 'y': 250},
            'text4': {'x': 350, 'y': 350},
            'text5': {'x': 450, 'y': 450}
        }
        self.coordinates = [
            (np.array([[0, 0], [100, 0], [100, 100], [0, 100]]), 'text1', 0.9),
            (np.array([[100, 100], [200, 100], [200, 200], [100, 200]]), 'text2', 0.9),
            (np.array([[200, 200], [300, 200], [300, 300], [200, 300]]), 'text3', 0.9),
            (np.array([[300, 300], [400, 300], [400, 400], [300, 400]]), 'text4', 0.9),
            (np.array([[400, 400], [500, 400], [500, 500], [400, 500]]), 'text5', 0.9)
        ]

        self.json_data_2 = {
            '[3/21-3/24 사은품 증정] 다이스 슈퍼소님 헤': {'x': 500, 'y': 1850},
            '어드라이어 HD15 (세라미 핑리로즈 골드)': {'x': 500, 'y': 1850},
            '499,000원': {'x': 500, 'y': 1850}}
        self.coordinates_2 = [
            (np.array([[0, 1700], [1000, 1700], [1000, 2000], [0, 2000]]), '[3/21-3/24 사은품 증정] 다이스 슈퍼소님 헤', 0.9),
            (np.array([[0, 1700], [1000, 1700], [1000, 2000], [0, 2000]]), '어드라이어 HD15 (세라미 핑리로즈 골드)', 0.9),
            (np.array([[0, 1700], [1000, 1700], [1000, 2000], [0, 2000]]), '499,000원', 0.9)
        ]

    def test_get_text_center_coordinates_returns_correct_values(self):
        result = get_text_center_coordinates(self.coordinates)
        self.assertEqual(result, self.json_data)
        result = get_text_center_coordinates(self.coordinates_2)
        self.assertEqual(result, self.json_data_2)

    def test_extract_texts_in_rectangle_returns_correct_values_for_full_overlap(self):
        texts = extract_texts_in_rectangle(self.json_data, (0, 0), (500, 500))
        self.assertEqual(texts, ['text1', 'text2', 'text3', 'text4', 'text5'])

    def test_extract_texts_in_rectangle_returns_correct_values_for_partial_overlap(self):
        texts = extract_texts_in_rectangle(self.json_data, (100, 100), (400, 400))
        self.assertEqual(texts, ['text2', 'text3', 'text4'])

    def test_extract_texts_in_rectangle_returns_correct_values_for_no_overlap(self):
        texts = extract_texts_in_rectangle(self.json_data, (500, 500), (600, 600))
        self.assertEqual(texts, [])

    def test_extract_texts_in_rectangle_returns_correct_values_for_edge_overlap(self):
        texts = extract_texts_in_rectangle(self.json_data, (400, 400), (500, 500))
        self.assertEqual(texts, ['text5'])

    def test_extract_texts_in_rectangle_returns_correct_values_for_given_example(self):
        texts = extract_texts_in_rectangle(self.json_data_2, (0, 1700), (1000, 2000))
        self.assertEqual(texts, ['[3/21-3/24 사은품 증정] 다이스 슈퍼소님 헤',
                                 '어드라이어 HD15 (세라미 핑리로즈 골드)',
                                 '499,000원'])
