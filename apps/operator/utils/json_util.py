import json

from core import operators


def create_tasks_from_json(json_string: str):
    """
    Create tasks from a JSON string.

    This function takes a JSON string that represents a list of tasks.

    :param json_string: A JSON string that represents a list of tasks.
    :return: A dictionary of operator instances. The keys are the task IDs and the values are the operator instances.
    """
    data = json.loads(json_string)

    tasks_obj = {task_data['task_id']: operators[task_data['class_name']].from_dict(task_data) for task_data in data}

    for task_data in data:
        task = tasks_obj[task_data['task_id']]
        for next_task_id in task_data.get('next', []):
            task.next(tasks_obj[next_task_id])

    return tasks_obj


if __name__ == '__main__':
    test_json_string = """
    [
        {
            "task_id": "condition_task",
            "condition": "10 > 1",
            "next": ["bash_task"],
            "class_name": "ConditionOperator"
        },
        {
            "task_id": "bash_task",
            "bash_command": "ls",
            "class_name": "BashOperator"
        }
    ]
    """

    tasks = create_tasks_from_json(test_json_string)
    task = tasks['condition_task']
    task.run()
