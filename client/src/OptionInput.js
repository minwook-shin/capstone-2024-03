import React from 'react';


function OptionInput({ inputValues, onInputChange, onInputConfirm }) {
    return (
        <>
            {Object.entries(inputValues).map(([key, value]) => (
                <input
                    key={key}
                    type="text"
                    name={key}
                    value={value}
                    onChange={onInputChange}
                    placeholder={`Enter ${key}`}
                    onKeyDown={event => {
                        if (event.key === 'Enter') {
                            onInputConfirm();
                        }
                    }}
                />
            ))}
        </>
    );
}

export default OptionInput;