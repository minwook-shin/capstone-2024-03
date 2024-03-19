import React from 'react';

function TaskList({ taskItems, handleDragStart }) {
    return (
        <div className="task">
            <h2>Available Tasks (Drag)</h2>
            <ul>
                {taskItems.map(item => (
                    <li
                        key={item.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, item)}
                    >
                        {item.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;