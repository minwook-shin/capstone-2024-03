import React from 'react';

function FlowList({ flowItems, handleDrop, handleDragOver }) {
    return (
        <div
            className="flow"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h2>Flow</h2>
            <ol>
                {flowItems.map(item => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ol>
        </div>
    );
}

export default FlowList;