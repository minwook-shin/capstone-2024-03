import React from 'react';

function ControlButtons({ handleButtonClick, handleButtonClear, handleButtonReload, handleButtonRun }) {
    return (
        <div>
            <button onClick={handleButtonClick}>Print JSON</button>
            <button onClick={handleButtonRun}>Run Flow</button>
            <button onClick={handleButtonClear}>Clear Flow</button>
            <button onClick={handleButtonReload}>refresh Screen</button>
        </div>
    );
}

export default ControlButtons;