import os
import subprocess
from time import sleep
import requests
from easy_adb import run_adb_server, download_adb_binary
from ppadb.client import Client as AdbClient

from utils.custom_logger import CustomLogger
from utils.file import create_directory
from utils.generator import generate_unique_value

logger_worker = CustomLogger().start_worker()
logger = logger_worker.get_logger()


def convert_template_string(template_string):
    url = "http://127.0.0.1:82/vm/render"
    headers = {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    data = {
        "template_string": template_string,
    }
    return requests.post(url, headers=headers, data=data).text


class ADB:
    def __init__(self):
        self.apk_path = 'https://github.com/senzhk/ADBKeyBoard/raw/master/ADBKeyboard.apk'
        try:
            adb_path = subprocess.check_output(['which', 'adb']).decode('utf-8').strip()
            adb_available = bool(adb_path)
        except subprocess.CalledProcessError:
            adb_available = False

        print(f"ADB Available: {adb_available}")

        if not adb_available:
            print("ADB is not available. Downloading ADB binary and starting ADB server.")
            download_adb_binary(agreement=True)
            run_adb_server()
            home_directory = os.path.expanduser("~")
            current_path = os.environ.get('PATH')
            adb_path = os.path.expanduser(os.path.join(home_directory, "adb/platform-tools/adb"))
            os.environ['PATH'] = f"{adb_path}:{current_path}"

        try:
            client = AdbClient(host="127.0.0.1", port=5037)
            devices = client.devices()
        except Exception as _:
            print("ADB server is not running. will automatically launch the ADB server.")
            subprocess.call(["adb", "start-server"])
            client = AdbClient(host="127.0.0.1", port=5037)
            devices = client.devices()

        if len(devices) == 0:
            logger.debug("No devices connected. ADB functionality will be disabled.")
            self.device = None
        else:
            device = devices[0]
            self.device = device

        logger.debug('Complete ADB Initialization Task')
        logger_worker.end_worker()

    def get_screen_capture(self, file_name=None):
        """
        Capture the screen of a device and save the image to a local file.

        Parameters:
        file_name (str): The local path where the image file should be saved.
        """
        if file_name is None:
            create_directory()
            file_name = "tmp/" + generate_unique_value() + '.png'
        result = self.device.screencap()
        with open(file_name, 'wb') as fp:
            fp.write(result)

        logger.debug('Complete screen capture task')
        logger_worker.end_worker()

    def execute_adb_scroll_up(self):
        """
        Execute the ADB command to scroll up on the device.

        Parameters:
        times (int): The number of times to scroll up.
        """
        self.device.shell('input swipe 300 300 500 1000')
        sleep(1)

        logger.debug('Complete scroll up task')
        logger_worker.end_worker()

    def execute_adb_scroll_down(self):
        """
        Execute the ADB command to scroll down on the device.

        Parameters:
        times (int): The number of times to scroll down.
        """
        self.device.shell('input swipe 500 1000 300 300')
        sleep(1)

        logger.debug('Complete scroll down task')
        logger_worker.end_worker()

    def is_adb_enabled(self):
        """
        Check if the ADB functionality is enabled.

        Returns:
        bool: True if ADB is enabled, False otherwise.
        """
        return self.device is not None

    def execute_adb_single_click(self, x, y):
        """
        Execute the ADB command to scroll down on the device.

        Parameters:
        x (int): The x-coordinate of the click.
        y (int): The y-coordinate of the click.
        """
        x = convert_template_string(x)
        y = convert_template_string(y)

        self.device.shell(f'input tap {x} {y}')
        sleep(1)

        logger.debug('Complete single click task')
        logger_worker.end_worker()

    def execute_adb_long_press(self, x, y):
        """
        Execute the ADB command to long press on the device.

        Parameters:
        x (int): The x-coordinate of the click.
        y (int): The y-coordinate of the click.
        """
        x = convert_template_string(x)
        y = convert_template_string(y)
        self.device.shell(f'input swipe {x} {y} {x} {y} 500')
        sleep(1)

        logger.debug('Complete long press task')
        logger_worker.end_worker()

    def execute_adb_short_cut(self, key_event):
        """
        Execute the ADB command to input a key event on the device.

        Parameters:
        key_event (int): The key event to be executed.
        """
        self.device.shell(f'input {key_event}')
        sleep(1)

        logger.debug('Complete short cut task')
        logger_worker.end_worker()

    def execute_adb_input_text(self, input_text):
        """
        Execute the ADB command to input text on the device.

        Parameters:
        input_text (str): The text to be input.
        """
        input_text = str(convert_template_string(input_text))
        sleep(1)
        self.device.shell(f'am broadcast -a ADB_INPUT_TEXT --es msg "{input_text}"')
        sleep(1)

        logger.debug('Complete input text task')
        logger_worker.end_worker()

    def install_adb_keyboard(self):
        """
        Install the ADB keyboard on the device.
        """
        if os.path.exists('ADBKeyboard.apk'):
            pass
        else:
            response = requests.get(self.apk_path)
            with open('ADBKeyboard.apk', 'wb') as f:
                f.write(response.content)
        self.device.install('ADBKeyboard.apk')
        self.device.shell('ime enable com.android.adbkeyboard/.AdbIME')
        self.device.shell('ime set com.android.adbkeyboard/.AdbIME')
        sleep(1)

        logger.debug('Complete install ADB keyboard')
        logger_worker.end_worker()

    def reset_adb_keyboard(self):
        """
        Reset the input method to the default keyboard.
        """
        self.device.shell('ime set com.android.adbkeyboard/.AdbIME')
        sleep(1)
        self.device.shell('ime reset')
        sleep(1)

        logger.debug('Complete reset ADB keyboard')
        logger_worker.end_worker()

    def check_adb_keyboard(self):
        """
        Check if the ADB keyboard is enabled.

        Returns:
        bool: True if the ADB keyboard is enabled, False otherwise.
        """
        return "com.android.adbkeyboard/.AdbIME" in self.device.shell("ime list -a -s")

    def template_matching_using_screen(self, template):
        """
        Perform template matching using the screen capture.

        Returns:
        bool: True if the template is found, False otherwise.
        """
        result = self.device.screencap()
        response = requests.post('http://localhost:81/template_matching',
                                 files={'image': result, 'template': template})
        print(response.json())
        self.execute_adb_single_click(response.json()['center_x'], response.json()['center_y'])

    def extract_text_using_screen(self, top_left_x, top_left_y, bottom_right_x, bottom_right_y, variable_name):
        """
        Perform extract text using the screen capture.

        Returns:
        bool: True if the extracted text is found, False otherwise.
        """
        top_left_x = convert_template_string(top_left_x)
        top_left_y = convert_template_string(top_left_y)
        bottom_right_x = convert_template_string(bottom_right_x)
        bottom_right_y = convert_template_string(bottom_right_y)
        variable_name = convert_template_string(variable_name)
        result = self.device.screencap()
        data = {
            "top_left_x": int(top_left_x),
            "top_left_y": int(top_left_y),
            "bottom_right_x": int(bottom_right_x),
            "bottom_right_y": int(bottom_right_y),
            }
        res = requests.post('http://localhost:81/extract_texts',
                      files={'image': result}, data=data).json()
        data = {"key": variable_name ,"value": " ".join(res["texts"])}
        requests.post('http://localhost:82/vm/var', data=data)

    def add_user_variable(self, variable_name, variable_value):
        """
        Add a user variable to the VM API.

        Parameters:
        key (str): The key of the user variable.
        value (str): The value of the user variable.
        """
        data = {"key": variable_name ,"value": variable_value}
        requests.post('http://localhost:82/vm/var', data=data)

    def run_python_script(self, code):
        """
        Run a Python script on the VM API.

        Parameters:
        script (str): The Python script to be executed.
        """
        requests.post('http://localhost:82/py/runner', data=code)

    def conditional_exit(self, condition_variable, condition_value):
        """
        Exit the script if the condition is met.

        Parameters:
        condition (str): The condition to be checked.
        """
        data = requests.get('http://localhost:82/vm/var').json()
        if data.get(condition_variable, None) == condition_value:
            return False

    def execute_adb_command(self, command):
        """
        Execute an ADB command on the device.

        Parameters:
        command (str): The ADB command to be executed.
        """
        self.device.shell(command)
        sleep(1)

        logger.debug('Complete ADB command task')
        logger_worker.end_worker()
