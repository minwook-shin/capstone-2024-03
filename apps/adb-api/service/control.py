import requests
from easy_adb import run_adb_server, download_adb_binary
import os
from ppadb.client import Client as AdbClient
from time import sleep

from utils.generator import generate_unique_value


class ADB:
    def __init__(self):
        self.apk_path = 'https://github.com/senzhk/ADBKeyBoard/raw/master/ADBKeyboard.apk'
        download_adb_binary(agreement=True)
        run_adb_server()
        home_directory = os.path.expanduser("~")
        current_path = os.environ.get('PATH')
        adb_path = os.path.expanduser(os.path.join(home_directory, "adb/platform-tools/adb"))
        os.environ['PATH'] = f"{adb_path}:{current_path}"

        client = AdbClient(host="127.0.0.1", port=5037)
        devices = client.devices()

        if len(devices) == 0:
            print("No devices connected. ADB functionality will be disabled.")
            self.device = None
        else:
            device = devices[0]
            self.device = device

    def get_screen_capture(self, file_name = None):
        """
        Capture the screen of a device and save the image to a local file.

        Parameters:
        file_name (str): The local path where the image file should be saved.
        """
        if file_name is None:
            file_name = "tmp/" + generate_unique_value() + '.png'
        result = self.device.screencap()
        with open(file_name, 'wb') as fp:
            fp.write(result)

    def execute_adb_scroll_up(self):
        """
        Execute the ADB command to scroll up on the device.

        Parameters:
        times (int): The number of times to scroll up.
        """
        self.device.shell('input swipe 300 300 500 1000')
        sleep(1)

    def execute_adb_scroll_down(self):
        """
        Execute the ADB command to scroll down on the device.

        Parameters:
        times (int): The number of times to scroll down.
        """
        self.device.shell('input swipe 500 1000 300 300')
        sleep(1)

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
        self.device.shell(f'input tap {x} {y}')
        sleep(1)

    def execute_adb_short_cut(self, key_event):
        """
        Execute the ADB command to input a key event on the device.

        Parameters:
        key_event (int): The key event to be executed.
        """
        self.device.shell(f'input {key_event}')
        sleep(1)

    def execute_adb_input_text(self, input_text):
        """
        Execute the ADB command to input text on the device.

        Parameters:
        input_text (str): The text to be input.
        """
        sleep(1)
        self.device.shell(f'am broadcast -a ADB_INPUT_TEXT --es msg {input_text}')
        sleep(1)

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

    def reset_adb_keyboard(self):
        """
        Reset the input method to the default keyboard.
        """
        self.device.shell('ime set com.android.adbkeyboard/.AdbIME')
        sleep(1)
        self.device.shell('ime reset')
        sleep(1)

    def check_adb_keyboard(self):
        """
        Check if the ADB keyboard is enabled.

        Returns:
        bool: True if the ADB keyboard is enabled, False otherwise.
        """
        return "com.android.adbkeyboard/.AdbIME" in self.device.shell("ime list -a -s")
