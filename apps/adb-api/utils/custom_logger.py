"""
Custom logger class to log messages to stdout using a separate thread.
"""
import logging

from q_logger_py import QueueHandler, ThreadStdoutWorker


class CustomLogger:
    """
    Custom logger class to log messages to stdout using a separate thread.
    """
    def __init__(self):
        queue_handler = QueueHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        self.thread_worker = ThreadStdoutWorker(queue_handler.log_queue, formatter=formatter)
        self.logger = logging.getLogger(__name__)
        self.logger.addHandler(queue_handler)
        self.logger.setLevel(logging.DEBUG)

    def get_logger(self):
        """
        Get the logger instance.
        """
        return self.logger

    def start_worker(self):
        """
        Start the worker thread.
        """
        self.thread_worker.start()
        return self

    def end_worker(self):
        """
        End the worker thread.
        """
        self.thread_worker.end()
        return self
