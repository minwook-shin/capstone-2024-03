import React, { useState } from 'react';
import IterationControl from './IterationControl';
import OptionInput from './OptionInput';

const API_URL = 'http://127.0.0.1';

function FlowList({ taskItems, initialTaskItems }) {
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [inputVisible, setInputVisible] = useState(false);
  const [flowItems, setFlowItems] = useState([]);
  const [pendingItem, setPendingItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

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
        await fetch(`${API_URL}/${text}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...rest, task_id: Date.now() }),
        });
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
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  };

  const onInputConfirm = async () => {
    const allFieldsFilled = Object.values(inputValues).every(value => value != null && value !== '');

    if (!allFieldsFilled) {
      alert('모든 필드를 채워주세요.');
      return;
    } else {
      const newItem = { ...pendingItem, ...inputValues };
      setFlowItems([...flowItems, newItem]);
      setInputVisible(false);
      setPendingItem(null);

      const task_id = Date.now();
      const time = parseInt(newItem.time, 10);
      if (initialTaskItems.map(item => item.text).includes(newItem.text)) {
        const body = { time, task_id };

        if (newItem.text === 'single_click') {
          body.x = parseInt(newItem.x, 10);
          body.y = parseInt(newItem.y, 10);
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
          body.x = parseInt(newItem.x, 10);
          body.y = parseInt(newItem.y, 10);
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
  const handleButtonClick = async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(JSON.stringify(flowItems));
    console.log(JSON.stringify(jsonResponse));
  };
  return (<div>
    {inputVisible && (
      <OptionInput
        inputValues={inputValues}
        onInputChange={onInputChange}
        onInputConfirm={onInputConfirm}
        onInputCancel={onInputCancel}
      />
    )}
    <div
      className="flow"
      onDrop={onDrop}
      onDragOver={handleDragOver}
    >
      <button onClick={handleButtonRun}>Run Flow</button>
      <button onClick={handleButtonClear}>Clear Flow</button>
      <button onClick={saveToFile}>Save to File</button>
      <input type="file" onChange={loadFromFile} />
      <h2>List of Flows to run (Drop)</h2>
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
    <IterationControl
      repeatCount={repeatCount}
      setRepeatCount={setRepeatCount}
      currentCount={currentCount}
      isPlaying={isPlaying}
    />
    <button onClick={handleButtonClick}> DEBUG : Print JSON</button>
  </div>
  );
}

export default FlowList;