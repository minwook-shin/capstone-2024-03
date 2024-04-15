
const BASE_URL = 'http://127.0.0.1';

export const DownloadScreenShot = async () => {
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

export const installKeyboard = async () => {
  const jsonResponse = await fetchData(`${BASE_URL}/install_keyboard`);
  console.log(jsonResponse);
};

export const resetKeyboard = async () => {
  const jsonResponse = await fetchData(`${BASE_URL}/reset_keyboard`);
  console.log(jsonResponse);
};


async function fetchData(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}

function ControlButtons() {
    
    return (
        <>
        </>
    );
}

export default ControlButtons;