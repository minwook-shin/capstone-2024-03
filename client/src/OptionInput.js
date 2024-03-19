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
                } 
                else if (key === 'functions') {
                    return (
                        <textarea
                        style={{ width: '100%' }}
                            key={key}
                            type="text"
                            name={key}
                            value={inputValues[key]}
                            onChange={onInputChange}
                            placeholder='Drag & drop here and create a list with brackets : [{"text": "scroll_down", "time": "2"}, ...]'
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
                else {
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