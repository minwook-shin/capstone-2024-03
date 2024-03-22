import os

from utils.custom_logger import CustomLogger

logger_worker = CustomLogger().start_worker()
logger = logger_worker.get_logger()


def create_directory(directory="tmp"):
    if not os.path.exists(directory):
        os.makedirs(directory)
        logger.debug(f'create {directory} directory')
        logger_worker.end_worker()
