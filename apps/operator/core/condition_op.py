from core.base_op import BaseOperator


class ConditionOperator(BaseOperator):
    def __init__(self, condition: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.condition = eval(condition)

    def execute(self, context: dict) -> bool:
        return self.condition

    @classmethod
    def from_dict(cls, data: dict):
        return cls(condition=data['condition'], task_id=data['task_id'])
