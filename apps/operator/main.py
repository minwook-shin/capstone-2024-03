from core import ConditionOperator, BashOperator

condition_task = ConditionOperator('10 > 1', task_id='condition_task')
bash_task = BashOperator('ls', task_id='bash_task')
bash_task2 = BashOperator('ls -al', task_id='bash_task2')

condition_task.next(bash_task).next(bash_task2)
condition_task.run()
