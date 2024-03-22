import React, { useEffect, useState } from 'react';

function ControlButtons() {
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    useEffect(() => {
        checkKeyboard();
    }, []);
    const installKeyboard = async () => {
      const response = await fetch('http://127.0.0.1/install_keyboard', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      checkKeyboard();
    };
  
    const resetKeyboard = async () => {
      const response = await fetch('http://127.0.0.1/reset_keyboard', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    };
  
    const checkKeyboard = async () => {
      const response = await fetch('http://127.0.0.1/check_keyboard', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      setKeyboardStatus(jsonResponse);
    };
    const DownloadScreenShot = async () => {
        const url = 'http://127.0.0.1/screen/download';
    
        const response = await fetch(url, {
          method: 'GET',
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'screenshot.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
    return (
        <div>
            <button onClick={DownloadScreenShot}>Download Saved ScreenShot</button> <br />
            <button onClick={installKeyboard}>Install Keyboard</button>
            <button onClick={resetKeyboard}>Reset Keyboard</button> <br />
            <label>Keyboard Status: {keyboardStatus ? "True" : "False"}</label>
        </div>
    );
}

export default ControlButtons;