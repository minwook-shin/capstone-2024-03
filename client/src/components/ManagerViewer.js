import React from 'react';
const { ipcRenderer } = window;

export const handleClickShowManager = (_) => {
    ipcRenderer.send("show_manager");
};

function ManagerViewer() {
    return (
        <></>
    );
}

export default ManagerViewer;