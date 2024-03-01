import subprocess

from core.base_op import BaseOperator


class BashOperator(BaseOperator):
    def __init__(self, bash_command: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.bash_command = bash_command

    def execute(self, context: dict) -> bool:
        process = subprocess.Popen(self.bash_command, stdout=subprocess.PIPE, shell=True)
        output, error = process.communicate()
        print(output.decode('utf-8'))
        return True

    @classmethod
    def from_dict(cls, data: dict):
        return cls(bash_command=data['bash_command'], task_id=data['task_id'])
