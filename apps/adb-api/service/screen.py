from easy_adb import run_adb_server, connect_device, set_signer, send_command, download_adb_binary, pull_command


def get_screen_capture(ip, port, file_name):
    download_adb_binary(agreement=True)
    run_adb_server()
    test_device = connect_device(set_signer(), ip, port)
    send_command(test_device, "screencap /sdcard/screen-tmp.png ")
    pull_command(test_device, "/sdcard/screen-tmp.png", local_path=file_name)
    send_command(test_device, "rm /sdcard/screen-tmp.png ")