import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList } from "react-window";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Tooltip from "@mui/material/Tooltip";

function TaskList({ taskItems, className, icons }) {
  /**
   * 드래그 시작 이벤트
   * 작업을 드래그할 때 시나리오에 추가할 데이터를 설정
   * @param {*} event
   * @param {*} item
   */
  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  /**
   * 각 항목을 랜더링하는 함수
   * 툴팁과 함께 커스텀된 ListItem을 반환
   * @param {*} props
   * @returns
   */
  const renderRow = (props) => {
    const { index, style } = props;
    const item = taskItems[index];
    return (
      <ListItem
        key={item.id}
        style={{
          ...style,
          border: "0.5px solid #ddd",
          borderLeft: "none",
          borderRight: "none",
          borderTop: "none",
        }}
        draggable
        onDragStart={(event) => handleDragStart(event, item)}
      >
        <ListItemText
          primary={
            <div style={{ display: "flex", alignItems: "center" }}>
              {set_icon(item)}
              <span style={{ marginLeft: "10px" }}>{item.display_text}</span>
            </div>
          }
        />
      </ListItem>
    );
  };

  const set_icon = (item) => {
    const Icon = icons[item.text];
    return Icon ? <Icon size={24} weight="duotone" /> : null;
  };
  return (
    <div style={{ width: "100%" }}>
      <h2>
        {" "}
        <DragIndicatorIcon style={{ verticalAlign: "middle" }} /> 사용 가능한
        작업{" "}
      </h2>
      <Tooltip
        title="작업을 추가하려면 '시나리오 목록'으로 끌어서 놓으세요."
        placement="bottom-start"
        arrow
      >
        <div>
          <FixedSizeList
            height={650}
            width="100%"
            itemSize={40}
            itemCount={taskItems.length}
            children={renderRow}
          />
          <label className={className}></label>
        </div>
      </Tooltip>
    </div>
  );
}

export default TaskList;
