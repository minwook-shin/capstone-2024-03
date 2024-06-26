"""
test image processing
"""
import os
import unittest
from service.image_processing import find_matches


class TestImageProcessing(unittest.TestCase):
    """
    Test image processing functions.
    """
    def setUp(self):
        with open('test_image.png', 'rb') as f:
            self.image_input = f.read()
        with open('test_template.png', 'rb') as f:
            self.template_input = f.read()

    @unittest.skipIf(os.environ.get('GITHUB_ACTIONS') == 'true',
                     'Skipping this test on GitHub Actions.')
    def test_find_matches_returns_correct_keys(self):
        """
        test find_matches returns correct keys
        """
        result = find_matches(self.image_input, self.template_input)
        self.assertIn('x', result)
        self.assertIn('y', result)
        self.assertIn('center_x', result)
        self.assertIn('center_y', result)
        self.assertIn('score', result)

    @unittest.skipIf(os.environ.get('GITHUB_ACTIONS') == 'true',
                     'Skipping this test on GitHub Actions.')
    def test_find_matches_with_identical_images(self):
        """
        test find_matches with identical images
        """
        result = find_matches(self.image_input, self.template_input)
        self.assertEqual(result['x'], 596)
        self.assertEqual(result['y'], 528)
        self.assertEqual(result['center_x'], 806)
        self.assertEqual(result['center_y'], 595)
        self.assertAlmostEqual(result['score'], 0.7, places=1)


if __name__ == '__main__':
    unittest.main()
