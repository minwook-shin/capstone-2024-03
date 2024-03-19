from f_scheduler import DAG, IterFunctionOperator, Converter
from flask import Blueprint, request, send_file

from service.control import ADB

controller = Blueprint('controller', __name__)


dag = DAG()
control_obj = ADB()
ordered_tasks = []


@controller.route('/')
def hello_world():
    adb_status = control_obj.is_adb_enabled()
    return {"ADB status": adb_status, "message": "If ADB status is False, please check the ADB connection"}


@controller.route('/screen', methods=['GET'])
def screen():
    """
    Capture the screen of a device and return the image.
    ---
    responses:
      200:
        description: Return the captured image
        content:
          image/png:
            schema:
              type: string
              format: binary
    """
    temp_file_name = "tmp.png"
    control_obj.get_screen_capture(file_name=temp_file_name)
    return send_file(temp_file_name, mimetype='image/png')


@controller.route('/scroll_up', methods=['POST'])
def scroll_up():
    """
    Scroll up on the device screen.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: scroll_up
          required:
            - time
            - task_id
          properties:
            time:
              type: integer
              description: The number of times to scroll up.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Scroll up operation added successfully.
    """
    time = request.json.get('time')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_scroll_up, param=([]),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'scroll_up added', 'time': time}, 200


@controller.route('/scroll_down', methods=['POST'])
def scroll_down():
    """
    Scroll down on the device screen.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: scroll_down
          required:
            - time
            - task_id
          properties:
            time:
              type: integer
              description: The number of times to scroll down.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Scroll down operation added successfully.
    """
    time = request.json.get('time')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_scroll_down, param=([]),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'scroll_down added', 'time': time}, 200


@controller.route('/single_click', methods=['POST'])
def single_click():
    """
    Execute a single click on the device screen.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: single_click
          required:
            - x
            - y
            - time
            - task_id
          properties:
            x:
              type: integer
              description: The x-coordinate of the click.
            y:
              type: integer
              description: The y-coordinate of the click.
            time:
              type: integer
              description: The number of times to single click.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Single click operation added successfully.
    """
    x = request.json.get('x')
    y = request.json.get('y')
    time = request.json.get('time')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_single_click, param=(x, y),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'single_click added', 'x': x, 'y': y, 'time': time}, 200


@controller.route('/run', methods=['GET'])
def execute_adb_operator():
    """
    Execute the ADB operations.
    ---
    responses:
      200:
        description: All ADB operations executed successfully.
    """
    if ordered_tasks:
        task_id = ordered_tasks[0]
    else:
        return {'message': 'No operators to execute'}, 200
    try:
        converter = Converter(dag)
        converter.convert_list_to_dag(ordered_tasks)
        dag.run(task_id)
    except Exception as e:
        return {'message': str(e)}, 500
    return {'message': 'All operators executed'}, 200


@controller.route('/clear', methods=['DELETE'])
def clear_adb_operator():
    """
    Clear all the ADB operations.
    ---
    responses:
      200:
        description: All ADB operations cleared successfully.
    """
    ordered_tasks.clear()
    dag.clear()
    return {'message': 'All operators cleared'}, 200


@controller.route('/tasks', methods=['get'])
def get_all_adb_operator():
    """
    Get all the ADB operations.
    ---
    responses:
      200:
        description: All ADB operations returned successfully.
    """
    return {'ordered_tasks': str(ordered_tasks), 'tasks': str(dag.get_all_tasks())}, 200
