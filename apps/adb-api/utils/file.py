"""
This file is used to create a directory if it does not exist.
"""
import os

from utils.custom_logger import CustomLogger

logger_worker = CustomLogger().start_worker()
logger = logger_worker.get_logger()


def create_directory(directory="tmp"):
    """
    Create a directory if it does not exist.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)
        logger.debug('create %s directory', directory)
        logger_worker.end_worker()
