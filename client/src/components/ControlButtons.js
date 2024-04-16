import { api } from "./../utils/requests";

const BASE_URL = "http://127.0.0.1";

/**
 * 화면 캡쳐 요청 함수
 */
export const DownloadScreenShot = async () => {
  const response = await api.get(`${BASE_URL}/screen/download`);
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "screenshot.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * ADB 키보드 설치 함수
 */
export const installKeyboard = async () => {
  const jsonResponse = await api.get(`${BASE_URL}/install_keyboard`);
  console.log(jsonResponse);
};

/**
 * ADB 키보드 리셋 함수
 */
export const resetKeyboard = async () => {
  const jsonResponse = await api.get(`${BASE_URL}/reset_keyboard`);
  console.log(jsonResponse);
};

function ControlButtons() {
  return <></>;
}

export default ControlButtons;
