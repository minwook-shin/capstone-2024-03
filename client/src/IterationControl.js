import React from 'react';

function IterationControl({ repeatCount, setRepeatCount, currentCount, isPlaying }) {
    return (
        <div>
            <div>
                <label>Iteration count </label>
                <input
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                />
            </div>
            <div>
                <label>Current Iteration count : {currentCount}</label>
            </div>
            <div>
            <label>{isPlaying ? "Playing..." : "Setting up a flow list..."}</label>
            </div>
        </div>
    );
}

export default IterationControl;