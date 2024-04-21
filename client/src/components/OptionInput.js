import React, { useEffect, useState } from "react";
import { TextField, Select, MenuItem, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AceEditor from "react-ace";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { handleHelpClick } from "../utils/initialTask.js";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "brace/mode/json";
import "ace-builds/webpack-resolver";

function OptionInput({
  inputValues,
  onInputChange,
  onInputConfirm,
  onInputCancel,
  onInputChangeForCode,
}) {
  const [keyEvents, setKeyEvents] = useState({});

  useEffect(() => {
    /**
     * 키 이벤트를 불러오는 함수
     */
    const loadKeyEvents = async () => {
      const response = await fetch("./key_event.json");
      const data = await response.json();
      setKeyEvents(data.key_events);
    };

    loadKeyEvents();
  }, []);

  /**
   * 키 입력 시 Enter를 누르면 입력을 완료하고, Escape를 누르면 입력을 취소하는 함수
   * @param {*} event
   * @param {*} key
   */
  const handleKeyDown = (event, key) => {
    if (event.key === "Enter") {
      onInputConfirm();
    } else if (event.key === "Escape") {
      onInputCancel();
    }
  };

  return (
    <>
      {Object.keys(inputValues).map((key) => {
        // text는 렌더링하지 않음
        if (key === "text") {
          return null;
        }
        // display_text는 렌더링하되, 수정 불가
        if (key === "display_text") {
          return (
            <Box
              key={key}
              padding={1}
              sx={{ color: "grey.500", justifyContent: "center" }}
            >
              <Typography
                onClick={() => {
                  handleHelpClick(inputValues["text"]);
                }}
              >
                <ContactSupportIcon
                  size={18}
                  style={{ verticalAlign: "middle" }}
                />
                {inputValues["text"]} 값을 설정하는 중...
              </Typography>
            </Box>
          );
        }
        // key_event는 Select로 렌더링
        // key_event의 value는 key_events.json 파일에서 불러옴
        if (key === "key_event") {
          return (
            <Select
              fullWidth
              key={key}
              name={key}
              value={inputValues[key]}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
            >
              {Object.entries(keyEvents).map(([eventKey, eventValue]) => (
                <MenuItem key={eventKey} value={eventValue}>
                  {eventKey}
                </MenuItem>
              ))}
            </Select>
          );
        }
        // template은 파일을 업로드하는 TextField로 렌더링
        if (key === "template") {
          return (
            <TextField
              fullWidth
              label={key}
              key={key}
              type="file"
              name={key}
              onChange={onInputChange}
              placeholder={`${key} 값을 입력하세요.`}
              onKeyDown={handleKeyDown}
              sx={{ my: 0.5 }}
            />
          );
          // functions는 TextField로 렌더링
          // 여러 줄 입력이 가능하며, Drag & drop을 통해 목록을 만들 수 있음
        } else if (key === "functions") {
          return (
            <TextField
              multiline
              InputProps={{
                rows: 3,
                multiline: true,
                inputComponent: "textarea",
              }}
              style={{ width: "100%" }}
              key={key}
              name={key}
              label={key}
              value={inputValues[key]}
              onChange={onInputChange}
              placeholder='여기에 Drag & drop 하고, 다음과 같이 목록을 만드세요 : [{"text": "scroll_down", "time": "2"}, ...]'
              onKeyDown={handleKeyDown}
            />
          );
          // code는 TextField로 렌더링
          // 여러 줄 입력이 가능하며, 마지막에 'return'이 존재할 때만 Enter를 눌러 입력을 완료할 수 있음
        } else if (key === "code") {
          return (
            <>
              <AceEditor
                mode="python"
                theme="github"
                onChange={onInputChangeForCode}
                fullWidth
                style={{ width: "100%" }}
                key={key}
                name={key}
                label={key}
                value={inputValues[key]}
                focus={true}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
              />
              <Typography>
                변수 사용하기 : data = user_var; <br />
                변수 입력하기 : from flask import g; g.local['user_var'] =
                'sample';
              </Typography>
              <ButtonGroup
                variant="text"
                aria-label="Basic button group"
                sx={{ display: "flex" }}
                fullWidth
                color="primary"
              >
                <Button onClick={onInputConfirm}>
                  <CheckIcon />
                </Button>
                <Button onClick={onInputCancel}>
                  <ClearIcon />
                </Button>
              </ButtonGroup>
            </>
          );
        }
        // x, y, top_left_x, top_left_y, bottom_right_x, bottom_right_y는 TextField로 렌더링
        // 안드로이드 스크린을 누르거나, 드래그하여 좌표 값을 변경할 수 있음
        // 수정 불가
        if (
          key === "x" ||
          key === "y" ||
          key === "top_left_x" ||
          key === "top_left_y" ||
          key === "bottom_right_x" ||
          key === "bottom_right_y"
        ) {
          return (
            <Tooltip
              key={key}
              title="안드로이드 스크린을 누르거나, 드래그하여 좌표 값을 변경하세요."
              placement="right-start"
              arrow
            >
              <TextField
                fullWidth
                key={key}
                type="text"
                name={key}
                label={key}
                value={inputValues[key]}
                onChange={onInputChange}
                placeholder={`${key} 값을 입력하세요.`}
                onKeyDown={handleKeyDown}
                sx={{ my: 0.5 }}
                disabled={true}
              />
            </Tooltip>
          );
          // 나머지 옵션은 TextField로 렌더링
        } else {
          return (
            <TextField
              fullWidth
              key={key}
              type="text"
              name={key}
              label={key}
              value={inputValues[key]}
              onChange={onInputChange}
              placeholder={`${key} 값을 입력하세요.`}
              onKeyDown={handleKeyDown}
              sx={{ my: 0.5 }}
            />
          );
        }
      })}
    </>
  );
}

export default OptionInput;
