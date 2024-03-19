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
                  <li key={item.id}>
                    {Object.entries(item).map(([key, value]) => {
                      if (key === 'id') return null;
                      if (key === 'text') return <span key={key}>{value}</span>;
                      return <span key={key}>{" | " + key}: {value} </span>;
                    })}
                  </li>
                ))}
              </ol>
            </div>
    );
}

export default FlowList;