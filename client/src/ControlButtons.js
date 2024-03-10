import React from 'react';

function ControlButtons({ handleButtonClick, handleButtonClear, handleButtonReload }) {
    return (
        <div>
            <button onClick={handleButtonClick}>Print JSON</button>
            <button onClick={handleButtonClear}>Clear JSON</button>
            <button onClick={handleButtonReload}>refresh Screen</button>
        </div>
    );
}

export default ControlButtons;