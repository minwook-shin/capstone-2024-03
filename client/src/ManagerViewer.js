import React from 'react';
const { ipcRenderer } = window;

function ManagerViewer() {
    const handleClickShowManager = (_) => {
        ipcRenderer.send("show_manager");
    };
    return (
        <div>
            <button onClick={handleClickShowManager}>Show Manager Windows</button><br />
        </div>
    );
}

export default ManagerViewer;