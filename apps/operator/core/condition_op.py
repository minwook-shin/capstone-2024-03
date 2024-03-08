from core.base_op import BaseOperator


class ConditionOperator(BaseOperator):
    """
    subclass of BaseOperator.
    """

    def __init__(self, condition: str, *args, **kwargs):
        """
        Initialize the operator with a condition and a task ID.

        :param condition: The condition to be evaluated.
        """
        super().__init__(*args, **kwargs)
        self.condition = eval(condition)

    def execute(self, context: dict) -> bool:
        """
        Evaluate the condition and return the result.

        :param context: The context for the task execution.
        :return: The result of the condition evaluation.
        """
        return self.condition

    @classmethod
    def from_dict(cls, data: dict):
        """
        Create a ConditionOperator instance from a dictionary.

        :param data: The data for creating the operator.
        :return: A new ConditionOperator instance.
        """
        return cls(condition=data['condition'], task_id=data['task_id'])
