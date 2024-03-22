from time import sleep

from utils.custom_logger import CustomLogger

logger_worker = CustomLogger().start_worker()
logger = logger_worker.get_logger()


def delay():
    """
    Add a delay to the task queue.

    Parameters:
    time (int): The number of seconds to delay.
    """
    sleep(1)
    logger.debug('Complete Delay Task')
    logger_worker.end_worker()
