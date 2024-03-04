class BaseOperator:
    """
    base class for operators.
    """

    def __init__(self, task_id: str):
        """
        Initialize the operator with a task ID.

        :param task_id: The ID of the task.
        """
        self.task_id = task_id
        self.next_task = list()

    def execute(self, context: dict):
        """
        Execute the task. This method should be overridden by subclasses.

        :param context: The context for the task execution.
        """
        raise NotImplementedError()

    def next(self, task):
        """
        Add a task to be executed after this one.

        :param task: The task to be added.
        :return: The current operator instance.
        """
        self.next_task.append(task)
        return self

    def run(self):
        """
        Run the task and then run the next tasks if the current task execution is successful.
        """
        result = self.execute({})
        if result:
            for task in self.next_task:
                task.run()

    @classmethod
    def from_dict(cls, data: dict):
        """
        Create an operator instance from a dictionary. This method should be overridden by subclasses.

        :param data: The data for creating the operator.
        """
        raise NotImplementedError()
