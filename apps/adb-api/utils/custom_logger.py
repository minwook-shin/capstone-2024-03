import logging

from q_logger_py import QueueHandler, ThreadStdoutWorker


class CustomLogger:
    def __init__(self):
        queue_handler = QueueHandler()
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        self.thread_worker = ThreadStdoutWorker(queue_handler.log_queue, formatter=formatter)
        self.logger = logging.getLogger(__name__)
        self.logger.addHandler(queue_handler)
        self.logger.setLevel(logging.DEBUG)

    def get_logger(self):
        return self.logger

    def start_worker(self):
        self.thread_worker.start()
        return self

    def end_worker(self):
        self.thread_worker.end()
        return self
