import React, { useState, useEffect, useCallback } from 'react';

function VariableManager() {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [variables, setVariables] = useState({});

    const handleKeyChange = (event) => {
        setKey(event.target.value);
    };

    const handleValueChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new URLSearchParams();
        formData.append('key', key);
        formData.append('value', value);
        await fetch('http://127.0.0.1:82/vm/var', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
    };

    const fetchVariables = useCallback(async () => {
        const response = await fetch('http://127.0.0.1:82/vm/var');
        const responseData = await response.json();
        setVariables(responseData);
    }, []);

    const handleKeyClick = (key) => {
        const str = `{{_local['${key}']}}`;
        navigator.clipboard.writeText(str);
        alert(`Copied ${str} to clipboard`);
    };

    useEffect(() => {
        fetchVariables();
    }, [fetchVariables]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={key} onChange={handleKeyChange} placeholder="Key" />
                <input type="text" value={value} onChange={handleValueChange} placeholder="Value" />
                <button type="submit">Submit</button>
                <button onClick={fetchVariables}>Refresh</button>
                <table style={{ margin: '0 auto' }}>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(variables).map(([key, value]) => (
                            <tr key={key}>
                                <td onClick={() => handleKeyClick(key)}>{key}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>


        </div>
    );
}

export default VariableManager;