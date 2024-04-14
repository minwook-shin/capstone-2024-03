#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if ! command -v adb &> /dev/null
    then
        echo "adb could not be found"
        echo "Installing adb..."
        sudo apt-get install android-tools-adb android-tools-fastboot
    else
        echo "adb is installed"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    if ! command -v adb &> /dev/null
    then
        echo "adb could not be found"
        echo "Installing adb..."
        if ! command -v brew &> /dev/null
        then
            echo "Homebrew is not installed. Installing..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install android-platform-tools
    else
        echo "adb is installed"
    fi
else
    echo "does not support this OS."
fi