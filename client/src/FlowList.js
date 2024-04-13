import React, { useEffect, useState } from 'react';
import IterationControl from './IterationControl';
import OptionInput from './OptionInput';
import { Box } from '@mui/material';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddTaskIcon from '@mui/icons-material/AddTask';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';


const API_URL = 'http://127.0.0.1';

function FlowList({ taskItems, initialTaskItems, dragCoords, clickCoords, className, className2}) {
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [inputVisible, setInputVisible] = useState(false);
  const [flowItems, setFlowItems] = useState([]);
  const [pendingItem, setPendingItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const saveToFile = () => {
    const data = JSON.stringify({ taskItems, flowItems });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'backup.json';
    link.click();

    URL.revokeObjectURL(url);
  };


  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = async (event) => {
      const response = await fetch(`${API_URL}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      setFlowItems([]);

      const flowItems = JSON.parse(event.target.result).flowItems;
      setFlowItems(flowItems);

      const newFlowItems = flowItems.map(item => {
        const { time, ...rest } = item;
        return { ...rest, time: parseInt(time, 10) };
      });
      for (const item of newFlowItems) {
        const { text, ...rest } = item;
        const task_id = Date.now();

        if (text === 'image_matching') {
          const formData = new FormData();
          const blob = new Blob([base64ToArrayBuffer(rest.template)], { type: 'image/png' });
          formData.append('template', blob, 'template.png');
          formData.append('task_id', task_id.toString());

          fetch(`${API_URL}/image_matching`, {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
        } else {
          await fetch(`${API_URL}/${text}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...rest, task_id }),
          });
        }
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const apiCall = async (url, method, body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}/${url}`, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  };

  const onInputChange = (event) => {
    if (event.target.files) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setInputValues({
          ...inputValues,
          template: fileReader.result,
        });
      };
      fileReader.readAsArrayBuffer(event.target.files[0]);
    } else {
      setInputValues({
        ...inputValues,
        [event.target.name]: event.target.value,
      });
    }
  };

  useEffect(() => {
    setInputValues(inputValues => {
      if (pendingItem && (pendingItem.text === 'single_click' || pendingItem.text === 'long_press')) {
        return { ...inputValues, ...clickCoords };
      } else if (pendingItem && pendingItem.text === 'extract_text') {
        return { ...inputValues, ...dragCoords };
      } else {
        return { ...inputValues };
      }
    });
  }, [dragCoords, clickCoords, pendingItem]);

  const onInputConfirm = async () => {
    const allFieldsFilled = Object.values(inputValues).every(value => value != null && value !== '');

    if (!allFieldsFilled) {
      alert('모든 필드를 채워주세요.');
      return;
    } else {
      const newItem = { ...pendingItem, ...inputValues };
      const newItemBase64 = { ...newItem };

      if (newItem.template) {
        newItemBase64.template = arrayBufferToBase64(newItem.template);
      }

      setFlowItems([...flowItems, newItemBase64]);
      setInputVisible(false);
      setPendingItem(null);

      const task_id = Date.now();
      const time = parseInt(newItem.time, 10);
      if (initialTaskItems.map(item => item.text).includes(newItem.text)) {
        const body = { time, task_id };

        if (newItem.text === 'single_click') {
          body.x = isNaN(parseInt(newItem.x, 10)) ? newItem.x : parseInt(newItem.x, 10);
          body.y = isNaN(parseInt(newItem.y, 10)) ? newItem.y : parseInt(newItem.y, 10);
        }
        else if (newItem.text === 'key_event') {
          body.key_event = newItem.key_event;
        }
        else if (newItem.text === 'loop') {
          body.functions = newItem.functions;
          body.time = newItem.time;
        }
        else if (newItem.text === 'input_text') {
          body.input_text = newItem.input_text;
        }
        else if (newItem.text === 'long_press') {
          body.x = isNaN(parseInt(newItem.x, 10)) ? newItem.x : parseInt(newItem.x, 10);
          body.y = isNaN(parseInt(newItem.y, 10)) ? newItem.y : parseInt(newItem.y, 10);
        }
        else if (newItem.text === 'image_matching') {
          const formData = new FormData();
          const blob = new Blob([newItem.template], { type: 'image/png' });
          formData.append('template', blob, 'template.png');
          formData.append('task_id', task_id);

          fetch(`${API_URL}/image_matching`, {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
          return;
        }
        else if (newItem.text === 'extract_text') {
          body.top_left_x = isNaN(parseInt(newItem.top_left_x, 10)) ? newItem.top_left_x : parseInt(newItem.top_left_x, 10);
          body.top_left_y = isNaN(parseInt(newItem.top_left_y, 10)) ? newItem.top_left_y : parseInt(newItem.top_left_y, 10);
          body.bottom_right_x = isNaN(parseInt(newItem.bottom_right_x, 10)) ? newItem.bottom_right_x : parseInt(newItem.bottom_right_x, 10);
          body.bottom_right_y = isNaN(parseInt(newItem.bottom_right_y, 10)) ? newItem.bottom_right_y : parseInt(newItem.bottom_right_y, 10);
          body.variable_name = newItem.variable_name;
        }
        else if (newItem.text === 'user_variable') {
          body.variable_name = newItem.variable_name;
          body.variable_value = newItem.variable_value;
        }
        else if (newItem.text === 'python_runner') {
          body.code = newItem.code;
        }
        const jsonResponse = await apiCall(newItem.text, 'POST', body);
        console.log(jsonResponse);
      }
    }
  };

  const onInputCancel = () => {
    setInputVisible(false);
    setPendingItem(null);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const item = { id: data.id, text: data.text };
    setInputVisible(true);
    setPendingItem(item);

    const taskItem = taskItems.find(taskItem => taskItem.text === data.text);
    setInputValues(taskItem || {});
  };

  const handleButtonClear = async () => {
    const response = await fetch(`${API_URL}/clear`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    setFlowItems([]);
  };

  const handleButtonRun = async () => {
    setIsPlaying(true);
    for (let i = 0; i < repeatCount; i++) {
      setCurrentCount(i + 1);

      const response = await fetch(`${API_URL}/run`, {
        method: 'GET'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    }
    setCurrentCount(0);
    setIsPlaying(false);
  };
  // const handleButtonClick = async () => {
  //   const response = await fetch(`${API_URL}/tasks`, {
  //     method: 'GET'
  //   });
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   const jsonResponse = await response.json();
  //   console.log(JSON.stringify(flowItems));
  //   console.log(JSON.stringify(jsonResponse));
  // };
  return (<div>
    {inputVisible && (
      <OptionInput
        inputValues={
          pendingItem.text === 'extract_text' ? { ...inputValues, ...dragCoords } :
            (pendingItem.text === 'single_click' || pendingItem.text === 'long_press') ? { ...inputValues, ...clickCoords } :
              inputValues
        }
        onInputChange={onInputChange}
        onInputConfirm={onInputConfirm}
        onInputCancel={onInputCancel}
      />
    )}
    <div
      onDrop={onDrop}
      onDragOver={handleDragOver}
      className={className}
    >
      <h2> <SendTimeExtensionIcon style={{ verticalAlign: 'middle' }} /> 시나리오 목록</h2>
      {flowItems.length === 0 &&
        <Box padding={0.5} sx={{ color: 'grey.500', justifyContent: 'center' }}><Typography><AddTaskIcon fontSize="small" style={{ verticalAlign: 'middle' }} /> 작업을 추가해주세요.</Typography>
        </Box>
      }
      <List>
        {flowItems.map(item => (
          <ListItem key={item.id} style={{ border: '0.5px solid #ddd', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
            {Object.entries(item).map(([key, value]) => {
              if (key === 'id') return null;
              if (key === 'text') return null;
              if (key === 'display_text') {
                return (
                  <Tooltip title={value} arrow>
                    <ListItemText primary={<Typography variant="caption" >{value.length > 5 ? value.substring(0, 5) + '...' : value} </Typography>} />
                  </Tooltip>
                );
              }
              if (key === 'template' && value) {
                return <ListItemText secondary={<img src={`data:image/png;base64,${value}`} alt="template" style={{ width: '15%', height: '15%' }} />} />;
              }
              return (
                <Tooltip title={`${key}: ${value}`} arrow>
                  <ListItemText secondary={<Typography variant="caption" >{`${key.length > 5 ? key.substring(0, 5) + '...' : key}: ${value.length > 5 ? value.substring(0, 5) + '...' : value}`}</Typography>} />
                </Tooltip>
              );
            })}
          </ListItem>
        ))}
      </List>
    </div>
    <IterationControl
      repeatCount={repeatCount}
      setRepeatCount={setRepeatCount}
      currentCount={currentCount}
      isPlaying={isPlaying}
    />
    <ButtonGroup fullWidth variant="text" aria-label="Basic button group" sx={{ display: 'flex' }} className={className2}>
      <Tooltip title="시나리오의 작업을 시작하려면 '실행' 버튼을 클릭합니다." placement="bottom-start" arrow>
        <Button onClick={handleButtonRun}><PlayCircleOutlineIcon /></Button>
      </Tooltip>
      <Tooltip title="시나리오의 모든 작업을 지우려면 '초기화' 버튼을 클릭합니다." placement="bottom-start" arrow>
        <Button onClick={handleButtonClear}><HighlightOffIcon /></Button>
      </Tooltip>
      <Tooltip title="시나리오를 파일로 내보내려면 '저장' 버튼을 클릭합니다." placement="bottom-start" arrow>
        <Button onClick={saveToFile}><SaveIcon /></Button>
      </Tooltip>
      <Tooltip title="파일에서 시나리오를 불러오려면 '복원' 버튼을 클릭합니다." placement="bottom-start" arrow>
        <Button component="label">
          <SettingsBackupRestoreIcon />
          <input type="file" onChange={loadFromFile} style={{ display: 'none' }} />
        </Button>
      </Tooltip>
    </ButtonGroup>

    {/* <button onClick={handleButtonClick}> DEBUG : Print JSON</button> */}

  </div>
  );
}

export default FlowList;