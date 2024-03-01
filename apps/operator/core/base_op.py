class BaseOperator:
    def __init__(self, task_id: str):
        self.task_id = task_id
        self.next_task = list()

    def execute(self, context: dict):
        raise NotImplementedError()

    def next(self, task):
        self.next_task.append(task)
        return self

    def run(self):
        result = self.execute({})
        if result:
            for task in self.next_task:
                task.run()

    @classmethod
    def from_dict(cls, data: dict):
        raise NotImplementedError()
