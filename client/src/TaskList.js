import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Tooltip from '@mui/material/Tooltip';

function TaskList({ taskItems, className }) {
    const handleDragStart = (event, item) => {
        event.dataTransfer.setData("text/plain", JSON.stringify(item));
    };

    const renderRow = (props) => {
        const { index, style } = props;
        const item = taskItems[index];
        return (
            <Tooltip title="작업을 추가하려면 '시나리오 목록'으로 끌어서 놓으세요." placement="right-start" arrow>
                <ListItem
                    key={item.id}
                    style={{ ...style, border: '0.5px solid #ddd', borderLeft: 'none', borderRight: 'none', borderTop: 'none'}}
                    draggable
                    onDragStart={(event) => handleDragStart(event, item)}
                >
                    <ListItemText primary={item.display_text} />
                </ListItem>
            </Tooltip>
        );
    };

    return (
        <div style={{ width: '100%' }}>
            <h2> <DragIndicatorIcon  style={{ verticalAlign: 'middle' }}/> 사용 가능한 작업 </h2>
            <FixedSizeList
                height={550}
                width="100%"
                itemSize={40}
                itemCount={taskItems.length}
                children={renderRow}
            />
            <label className={className}></label>
        </div>
    );
}

export default TaskList;