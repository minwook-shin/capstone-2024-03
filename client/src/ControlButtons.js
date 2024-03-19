import React from 'react';

function ControlButtons({ handleButtonClick, handleButtonClear, handleButtonReload, handleButtonRun, saveToFile, loadFromFile}) {
    return (
        <div>
            <button onClick={handleButtonClick}>Print JSON</button>
            <button onClick={handleButtonRun}>Run Flow</button>
            <button onClick={handleButtonClear}>Clear Flow</button>
            <button onClick={handleButtonReload}>refresh Screen</button><br />
            <button onClick={saveToFile}>Save to File</button>
            <input type="file" onChange={loadFromFile} />
        </div>
    );
}

export default ControlButtons;