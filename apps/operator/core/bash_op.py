import subprocess

from core.base_op import BaseOperator


class BashOperator(BaseOperator):
    """
    subclass of BaseOperator.
    """

    def __init__(self, bash_command: str, *args, **kwargs):
        """
        Initialize the operator with a bash command and a task ID.

        :param bash_command: The bash command to be executed.
        """
        super().__init__(*args, **kwargs)
        self.bash_command = bash_command

    def execute(self, context: dict) -> bool:
        """
        Execute the bash command and print the output.

        :param context: The context for the task execution.
        :return: Always returns True.
        """
        process = subprocess.Popen(self.bash_command, stdout=subprocess.PIPE, shell=True)
        output, error = process.communicate()
        print(output.decode('utf-8'))
        return True

    @classmethod
    def from_dict(cls, data: dict):
        """
        Create a BashOperator instance from a dictionary.

        :param data: The data for creating the operator.
        :return: A new BashOperator instance.
        """
        return cls(bash_command=data['bash_command'], task_id=data['task_id'])
