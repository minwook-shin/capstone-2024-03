import React, { useEffect, useState } from 'react';


function OptionInput({ inputValues, onInputChange, onInputConfirm, onInputCancel}) {
    const [keyEvents, setKeyEvents] = useState({});

    useEffect(() => {
        const loadKeyEvents = async () => {
          const response = await fetch('./key_event.json');
          const data = await response.json();
          setKeyEvents(data.key_events);
        };
    
        loadKeyEvents();
      }, []);
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
                if (key === 'template') {
                    return (
                        <input
                            key={key}
                            type="file"
                            name={key}
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