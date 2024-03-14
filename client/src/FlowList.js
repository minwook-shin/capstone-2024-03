import React from 'react';

function FlowList({ flowItems, onDrop, handleDragOver }) {
    return (
        <div
              className="flow"
              onDrop={onDrop}
              onDragOver={handleDragOver}
            >
              <h2>Flow</h2>
              <ol>
                {flowItems.map(item => (
                  <li key={item.id}>{item.text} * {item.time}</li>
                ))}
              </ol>
            </div>
    );
}

export default FlowList;