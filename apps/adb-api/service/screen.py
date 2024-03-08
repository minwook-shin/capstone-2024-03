from easy_adb import run_adb_server, download_adb_binary
import os
from ppadb.client import Client as AdbClient


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
            quit()

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
