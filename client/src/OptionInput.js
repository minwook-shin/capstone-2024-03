import React from 'react';


function OptionInput({ inputValues, onInputChange, onInputConfirm, keyEvents ,onInputCancel}) {
    return (
        <>
            {Object.keys(inputValues).map((key) => {
                if (key === 'key_event') {
                    return (
                        <select
                            key={key}
                            name={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            readOnly={key === 'text'}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                        >
                            {Object.entries(keyEvents).map(([eventKey, eventValue]) => (
                                <option key={eventKey} value={eventValue}>
                                    {eventKey}
                                </option>
                            ))}
                        </select>
                    );
                } else {
                    return (
                        <input
                            key={key}
                            type="text"
                            name={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            placeholder={`Enter ${key}`}
                            readOnly={key === 'text'}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    onInputConfirm();
                                }
                                else if (event.key === 'Escape') {
                                    onInputCancel();
                                }
                            }}
                        />
                    );
                }
            })}
        </>
    );
}

export default OptionInput;