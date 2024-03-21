import os


def create_directory(directory="tmp"):
    if not os.path.exists(directory):
        os.makedirs(directory)
