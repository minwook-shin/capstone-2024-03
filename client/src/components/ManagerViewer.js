import React from "react";
const { ipcRenderer } = window;

/**
 * 결과 매니저 창을 띄우는 함수
 * @param {*} _ 
 */
export const handleClickShowManager = (_) => {
  ipcRenderer.send("show_manager");
};

function ManagerViewer() {
  return <></>;
}

export default ManagerViewer;
