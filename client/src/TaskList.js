import React from 'react';

function TaskList({ taskItems}) {

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };
    return (
        <div className="task">
            <h2>사용 가능한 작업 (끌기)</h2>
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