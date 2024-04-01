import React from 'react';
const { ipcRenderer } = window;

function ManagerViewer() {
    const handleClickShowManager = (_) => {
        ipcRenderer.send("show_manager");
    };
    return (
        <div>
            <button onClick={handleClickShowManager}>Show Scenario Result</button><br />
        </div>
    );
}

export default ManagerViewer;