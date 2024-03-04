from easy_adb import run_adb_server, connect_device, set_signer, send_command, download_adb_binary, pull_command


def get_screen_capture(ip, port, file_name):
    """
    Capture the screen of a device and save the image to a local file.

    This function uses the easy_adb library to interact with an Android device.
    It starts the ADB server, connects to the device, sends a screencap command,
    pulls the resulting image file to the local machine, and then removes the
    temporary image file from the device.

    Parameters:
    ip (str): The IP address of the device.
    port (str): The port number to connect to on the device.
    file_name (str): The local path where the image file should be saved.
    """
    download_adb_binary(agreement=True)
    run_adb_server()
    test_device = connect_device(set_signer(), ip, port)
    send_command(test_device, "screencap /sdcard/screen-tmp.png ")
    pull_command(test_device, "/sdcard/screen-tmp.png", local_path=file_name)
    send_command(test_device, "rm /sdcard/screen-tmp.png ")