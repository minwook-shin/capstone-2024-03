"""
This module contains the API endpoints for the ADB control operations.
"""
import json
import os
import zipfile

from f_scheduler import DAG, IterFunctionOperator, Converter, DefaultFunctionOperator
from flask import Blueprint, request, send_file
from werkzeug.datastructures import FileStorage

from service.control import ADB
from service.extra import delay

controller = Blueprint('controller', __name__)

dag = DAG()
control_obj = ADB()
ordered_tasks = []


@controller.route('/')
def hello_world():
    """
    ADB status check.
    """
    adb_status = control_obj.is_adb_enabled()
    return {"ADB status": adb_status,
            "message": "If ADB status is False, please check the ADB connection"}


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


@controller.route('/screen_capture', methods=['POST'])
def screen_capture():
    """
    Capture the screen of a device and save the image to a local file.
    ---
    parameters:
       - in: body
         name: body
         schema:
             id: screen_capture
             required:
                 - time
                 - task_id
             properties:
                 time:
                     type: integer
                     description: The number of times to capture the screen.
                 task_id:
                     type: string
                     description: The ID of the task.
    responses:
        200:
            description: Screen capture operation added successfully.
    """
    time = request.json.get('time')
    task_id = request.json.get('task_id')
    dag.add_task(IterFunctionOperator(function=control_obj.get_screen_capture,
                                      param=([]),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'screen_capture added', 'time': time}, 200


@controller.route('/screen/download', methods=['GET'])
def download_images():
    """
    save the screen of a device and return the zip.
    ---
    responses:
      200:
        description: Return the captured image
        content:
          application/zip:
            schema:
              type: string
              format: binary
    """
    image_directory = 'tmp'
    zip_filename = 'images.zip'
    zip_path = os.path.join(zip_filename)

    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, _, files in os.walk(image_directory):
            for file in files:
                zipf.write(os.path.join(root, file), arcname=file)

    for root, _, files in os.walk(image_directory):
        for file in files:
            os.remove(os.path.join(root, file))

    return send_file(zip_path, as_attachment=True,
                     mimetype='application/zip', download_name=zip_filename)


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


@controller.route('/long_press', methods=['POST'])
def long_press():
    """
    Execute a long press on the device screen.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: long_press
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
              description: The number of times to long press.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Long press operation added successfully.
    """
    x = request.json.get('x')
    y = request.json.get('y')
    time = request.json.get('time')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_long_press, param=(x, y),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'long_press added', 'x': x, 'y': y, 'time': time}, 200


@controller.route('/key_event', methods=['POST'])
def short_cut():
    """
    Execute a shortcut on the device.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: key_event
          required:
            - key_event
            - task_id
            - time
          properties:
            key_event:
              type: integer
              description: The key event to be executed.
            task_id:
              type: string
              description: The ID of the task.
            time:
              type: integer
              description: The number of times to single click.
    responses:
      200:
        description: Shortcut operation added successfully.
    """
    key_event = request.json.get('key_event')
    task_id = request.json.get('task_id')
    time = request.json.get('time')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_short_cut,
                                      param=(key_event,),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'short_cut added', 'key_event': key_event, 'time': time}, 200


@controller.route('/input_text', methods=['POST'])
def input_text():
    """
    Execute an input text on the device.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: input_text
          required:
            - text
            - task_id
            - time
          properties:
            text:
              type: string
              description: The text to be input.
            task_id:
              type: string
              description: The ID of the task.
            time:
              type: integer
              description: The number of times to input the text.
    responses:
      200:
        description: Text input operation added successfully.
    """
    text = request.json.get('input_text')
    task_id = request.json.get('task_id')
    time = request.json.get('time')

    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_input_text, param=(text,),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'input_text added', 'text': text, 'time': time}, 200


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
    except Exception as e:  # pylint: disable=W0718
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


@controller.route('/update', methods=['POST'])
def update_adb_operator():
    """
    Update the ADB operations.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: update
          required:
            - task_id
            - new_param
          properties:
            task_order:
              type: integer
              description: The order of the task.
            new_param:
              type: array
              items:
                type: string
              description: The properties to be updated.
    responses:
      200:
        description: ADB operations updated successfully.
    """
    task_order = request.json.get('task_order')
    new_param = request.json.get('new_param')
    if ordered_tasks:
        task_id = ordered_tasks[task_order]
    else:
        return {'message': 'No operators to execute'}, 200
    dag.update_task(int(task_id), new_param)
    return {'message': 'task updated  successfully'}, 200


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


@controller.route('/delay', methods=['POST'])
def delay_seconds():
    """
    Add a delay to the task queue.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: delay
          required:
            - time
          properties:
            time:
              type: integer
              description: The number of seconds to delay.
    responses:
      200:
        description: Delay operation added successfully.
    """
    time = request.json.get('time')
    task_id = request.json.get('task_id')
    dag.add_task(IterFunctionOperator(function=delay, param=([]), task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'delay added', 'time': time}, 200


@controller.route('/loop', methods=['POST'])
def functions_iterator():
    """
    Add a function to the task queue.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: loop
          required:
            - functions
            - task_id
            - time
          properties:
            functions:
              type: string
              description: The functions to be executed.
            task_id:
              type: string
              description: The ID of the task.
            time:
              type: integer
              description: The number of iterations to execute the function.
    responses:
      200:
        description: Function operation added successfully.
    """
    functions = request.json.get('functions')
    task_id = request.json.get('task_id')
    iterations = request.json.get('time')

    function_mapping = {
        "single_click": control_obj.execute_adb_single_click,
        "delay": delay,
        "scroll_down": control_obj.execute_adb_scroll_down,
        "scroll_up": control_obj.execute_adb_scroll_up,
        "key_event": control_obj.execute_adb_short_cut,
        "screen_capture": control_obj.get_screen_capture,
        "input_text": control_obj.execute_adb_input_text,
        "long_press": control_obj.execute_adb_long_press,
        "image_matching": control_obj.template_matching_using_screen,
        "extract_text": control_obj.extract_text_using_screen,
        "user_variable": control_obj.add_user_variable,
        "python_runner": control_obj.run_python_script,
        "adb_command": control_obj.execute_adb_command,
        "slack_message": control_obj.send_slack,
        "notion_page": control_obj.create_notion_page,
    }
    functions = json.loads(functions)

    def combined_function():
        for function in functions:
            function_name = function.get('text')
            function_to_call = function_mapping.get(function_name)
            if function_to_call:
                params = {k: v for k, v in function.items() if k != 'text'}
                time = int(function.get('time', 1))
                params = {k: v for k, v in params.items() if k != 'time'}
                params.pop('display_text', None)
                for _ in range(time):
                    function_to_call(**params)

    dag.add_task(IterFunctionOperator(function=combined_function, param=(),
                                      task_id=task_id, iterations=int(iterations)))
    ordered_tasks.append(task_id)

    return {'message': 'function added', 'function': functions, 'iterations': iterations}, 200


@controller.route('/install_keyboard', methods=['GET'])
def install_adb_keyboard():
    """
    Install the ADB keyboard on the device.
    ---
    responses:
      200:
        description: ADB keyboard installed successfully.
    """
    control_obj.install_adb_keyboard()
    return {'message': 'ADB keyboard installed'}, 200


@controller.route('/reset_keyboard', methods=['GET'])
def reset_adb_keyboard():
    """
    Install the ADB keyboard on the device.
    ---
    responses:
      200:
        description: ADB keyboard installed successfully.
    """
    control_obj.reset_adb_keyboard()
    return {'message': 'ADB keyboard removed'}, 200


@controller.route('/check_keyboard', methods=['GET'])
def check_adb_keyboard():
    """
    Install the ADB keyboard on the device.
    ---
    responses:
      200:
        description: Is ADB keyboard installed.
    """
    return {'ADB keyboard installed': control_obj.check_adb_keyboard()}, 200


@controller.route('/image_matching', methods=['POST'])
def template_matching():
    """
    Perform template matching on the device screen using the provided template image.
    ---
    parameters:
      - in: formData
        name: template
        type: file
        description: The template image file to be used for matching.
        required: true
      - in: body
        name: body
        schema:
          id: image_matching
          required:
            - task_id
          properties:
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Template matching operation added successfully.
    """
    template: FileStorage = request.files.get('template')
    task_id = request.form.get('task_id')
    template_bytes = template.read()
    dag.add_task(IterFunctionOperator(function=control_obj.template_matching_using_screen,
                                      param=(template_bytes,),
                                      task_id=task_id, iterations=1))
    ordered_tasks.append(task_id)
    return {'message': 'template_matching added', 'template_path': template.filename}, 200

@controller.route('/extract_text', methods=['POST'])
def extract_text():
    """
    Extract text from an image using OCR.
    ---
    parameters:
      - in: formData
        name: image
        type: file
        description: The image file to extract text from.
        required: true
      - in: body
        name: body
        schema:
          id: extract_text
          required:
            - task_id
          properties:
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Text extraction operation added successfully.
    """
    top_left_x = request.json.get('top_left_x')
    top_left_y = request.json.get('top_left_y')
    bottom_right_x = request.json.get('bottom_right_x')
    bottom_right_y = request.json.get('bottom_right_y')
    variable_name = request.json.get('variable_name')
    task_id = request.json.get('task_id')
    dag.add_task(IterFunctionOperator(function=control_obj.extract_text_using_screen,
                                      param=(top_left_x, top_left_y, bottom_right_x,
                                             bottom_right_y, variable_name),
                                      task_id=task_id, iterations=1))
    ordered_tasks.append(task_id)
    return {'message': 'text extraction added',
            'arguments': f'{top_left_x}, {top_left_y}, {bottom_right_x}, {bottom_right_y}'}, 200


@controller.route('/user_variable', methods=['POST'])
def user_variable():
    """
    Add a user variable to the task queue.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: user_variable
          required:
            - variable_name
            - variable_value
            - task_id
          properties:
            variable_name:
              type: string
              description: The name of the variable.
            variable_value:
              type: string
              description: The value of the variable.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: User variable operation added successfully.
    """
    variable_name = request.json.get('variable_name')
    variable_value = request.json.get('variable_value')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.add_user_variable,
                                      param=(variable_name, variable_value),
                                      task_id=task_id, iterations=1))
    ordered_tasks.append(task_id)
    return {'message': 'user_variable added',
            'variable_name': variable_name, 'variable_value': variable_value}, 200


@controller.route('/python_runner', methods=['POST'])
def python_runner():
    """
    Run a python script on the device.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: python_runner
          required:
            - code
            - time
            - task_id
          properties:
            code:
              type: string
              description: The python script to be executed.
            task_id:
              type: string
              description: The ID of the task.
            time:
              type: integer
              description: The number of times to run the script.
    responses:
      200:
        description: Python script operation added successfully.
    """
    code = request.json.get('code')
    time = request.json.get('time')
    task_id = request.json.get('task_id')

    dag.add_task(IterFunctionOperator(function=control_obj.run_python_script, param=(code,),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)
    return {'message': 'python_runner added', 'code': code}, 200

@controller.route('/conditional_exit', methods=['POST'])
def conditional_exit():
    """
    Exit the loop based on the condition.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: conditional_exit
          required:
            - condition
            - task_id
          properties:
            condition:
              type: string
              description: The condition to exit the loop.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Conditional exit operation added successfully.
    """
    condition_variable = request.json.get('condition_variable')
    condition_value = request.json.get('condition_value')
    task_id = request.json.get('task_id')
    dag.add_task(DefaultFunctionOperator(function=control_obj.conditional_exit,
                                         param=(condition_variable, condition_value),
                                         task_id=task_id))
    ordered_tasks.append(task_id)
    return {'message': 'conditional_exit added', 'condition_variable': condition_variable}, 200


@controller.route('/adb_command', methods=['POST'])
def adb_command():
    """
    Execute an ADB command on the device.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: adb_command
          required:
            - command
            - task_id
          properties:
            command:
              type: string
              description: The ADB command to be executed.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: ADB command operation added successfully.
    """
    command = request.json.get('command')
    time = request.json.get('time')
    task_id = request.json.get('task_id')
    dag.add_task(IterFunctionOperator(function=control_obj.execute_adb_command, param=(command,),
                                      task_id=task_id, iterations=time))
    ordered_tasks.append(task_id)

    return {'message': 'adb_command added', 'command': command}, 200


@controller.route('/slack_message', methods=['POST'])
def slack_message():
    """
    Send a message to a Slack channel.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: slack_message
          required:
            - message
            - task_id
          properties:
            message:
              type: string
              description: The message to be sent.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Slack message operation added successfully.
    """
    message = request.json.get('message')
    incoming_webhook_url = request.json.get('incoming_webhook_url')
    task_id = request.json.get('task_id')
    dag.add_task(IterFunctionOperator(function=control_obj.send_slack,
                                      param=(incoming_webhook_url, message,),
                                      task_id=task_id, iterations=1))
    ordered_tasks.append(task_id)

    return {'message': 'slack_message added', 'slack': message}, 200


@controller.route('/notion_page', methods=['POST'])
def notion_page():
    """
    Create a new page in Notion.
    ---
    parameters:
      - in: body
        name: body
        schema:
          id: notion_page
          required:
            - page_title
            - page_content
            - task_id
          properties:
            page_title:
              type: string
              description: The title of the page.
            page_content:
              type: string
              description: The content of the page.
            task_id:
              type: string
              description: The ID of the task.
    responses:
      200:
        description: Notion page operation added successfully.
    """
    title = request.json.get('title')
    content = request.json.get('content')
    task_id = request.json.get('task_id')
    token = request.json.get('token')
    database_id = request.json.get('database_id')
    dag.add_task(IterFunctionOperator(function=control_obj.create_notion_page,
                                      param=(token, database_id, title, content),
                                      task_id=task_id, iterations=1))
    ordered_tasks.append(task_id)

    return {'message': 'notion_page added', 'page_title': title}, 200
