import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://127.0.0.1';

async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

function ControlButtons() {
    const [keyboardStatus, setKeyboardStatus] = useState(false);
    useEffect(() => {
        checkKeyboard();
    }, []);
    const installKeyboard = async () => {
      const jsonResponse = await fetchData(`${BASE_URL}/install_keyboard`);
      console.log(jsonResponse);
      checkKeyboard();
    };
  
    const resetKeyboard = async () => {
      const jsonResponse = await fetchData(`${BASE_URL}/reset_keyboard`);
      console.log(jsonResponse);
    };
  
    const checkKeyboard = async () => {
      const jsonResponse = await fetchData(`${BASE_URL}/check_keyboard`);
      setKeyboardStatus(jsonResponse);
    };
    const DownloadScreenShot = async () => {
        const url = `${BASE_URL}/screen/download`;
    
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