from easy_adb import run_adb_server, download_adb_binary
import os
from ppadb.client import Client as AdbClient
from time import sleep


class ADB:
    def __init__(self):
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

    def get_screen_capture(self, file_name):
        """
        Capture the screen of a device and save the image to a local file.

        Parameters:
        file_name (str): The local path where the image file should be saved.
        """
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
