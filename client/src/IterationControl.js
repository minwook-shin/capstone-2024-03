import React from 'react';

function IterationControl({ repeatCount, setRepeatCount, currentCount, isPlaying }) {
    return (
        <div>
            <div>
                <label>Total Loop count </label>
                <input
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                />
            </div>
            <div>
                <label>Current Total Loop count : {currentCount}</label>
            </div>
            <div>
            <label>{isPlaying ? "Playing..." : "Setting up a flow list..."}</label>
            </div>
        </div>
    );
}

export default IterationControl;