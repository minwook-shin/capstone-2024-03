import { useEffect, useState } from "react";
import './App.css';
import TaskList from './TaskList';
import FlowList from './FlowList';
import ControlButtons from './ControlButtons';
import ScreenViewer from './ScreenViewer';
import OptionInput from './OptionInput';
import IterationControl from './IterationControl';


const { ipcRenderer } = window;

function App() {
  const [taskItems, setTaskItems] = useState([]);

  const [flowItems, setFlowItems] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputVisible, setInputVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [keyEvents, setKeyEvents] = useState({});

  const [repeatCount, setRepeatCount] = useState(1);
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [func_inputValues, func_setInputValues] = useState({});

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const installKeyboard = async () => {
    const response = await fetch('http://127.0.0.1/install_keyboard', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    checkKeyboard();
  };

  const resetKeyboard = async () => {
    const response = await fetch('http://127.0.0.1/reset_keyboard', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  };

  const checkKeyboard = async () => {
    const response = await fetch('http://127.0.0.1/check_keyboard', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    setKeyboardStatus(jsonResponse);
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

    const response = await fetch(`http://127.0.0.1/${url}`, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const response = await fetch('http://127.0.0.1/clear', {
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
        await fetch(`http://127.0.0.1/${text}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...rest, task_id: Date.now() }),
        });
      }
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    const initialTaskItems = [
      { text: "scroll_up", time: '' },
      { text: "scroll_down", time: '' },
      { text: "single_click", x: '', y: '', time: '' },
      { text: "long_press", x: '', y: '', time: '' },
      { text: "short_cut", key_event: '', time: '' },
      { text: "delay", time: '' },
      { text: "iteration", time: '', functions: [] },
      { text: "input_text", time: '', input_text: '' },
      { text: "screen_capture", time: '' }
    ];
    setTaskItems(initialTaskItems);

    setIsLoading(true);
    ipcRenderer.send("screen");
    ipcRenderer.on("screen", (event, args) => {
      const blob = new Blob([args.screen], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
      setIsLoading(false);
    });

    const loadKeyEvents = async () => {
      const response = await fetch('./key_event.json');
      const data = await response.json();
      setKeyEvents(data.key_events);
    };

    loadKeyEvents();
    checkKeyboard();
  }, []);

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const item = { id: data.id, text: data.text };
    setInputVisible(true);
    setPendingItem(item);

    const taskItem = taskItems.find(taskItem => taskItem.text === data.text);
    setInputValues(taskItem || {});
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

      if (['scroll_up', 'scroll_down', 'single_click', 'short_cut', 'delay', 'iteration', 'input_text', 'screen_capture', 'long_press'].includes(newItem.text)) {
        const body = { time, task_id };

        if (newItem.text === 'single_click') {
          body.x = parseInt(newItem.x, 10);
          body.y = parseInt(newItem.y, 10);
        }
        else if (newItem.text === 'short_cut') {
          body.key_event = newItem.key_event;
        }
        else if (newItem.text === 'iteration') {
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


  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = async () => {
    const response = await fetch('http://127.0.0.1/tasks', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(JSON.stringify(flowItems));
    console.log(JSON.stringify(jsonResponse));
  };


  const handleButtonClear = async () => {
    const response = await fetch('http://127.0.0.1/clear', {
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

  const handleButtonReload = () => {
    ipcRenderer.send("screen");
  };

  const handleButtonRun = async () => {
    setIsPlaying(true);
    for (let i = 0; i < repeatCount; i++) {
      setCurrentCount(i + 1);

      const response = await fetch('http://127.0.0.1/run', {
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

  const DownloadScreenShot = async () => {
    const url = 'http://127.0.0.1/screen/download';

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'screenshot.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            {inputVisible && (
              <OptionInput
                inputValues={inputValues}
                onInputChange={onInputChange}
                onInputConfirm={onInputConfirm}
                onInputCancel={onInputCancel}
                keyEvents={keyEvents}
                func_inputValues={func_inputValues}
                func_setInputValues={func_setInputValues}
              />
            )}
            <TaskList taskItems={taskItems} handleDragStart={handleDragStart} />
            <FlowList flowItems={flowItems} onDrop={onDrop} handleDragOver={handleDragOver} />
            <IterationControl
              repeatCount={repeatCount}
              setRepeatCount={setRepeatCount}
              currentCount={currentCount}
              isPlaying={isPlaying}
            />
            <ControlButtons handleButtonClick={handleButtonClick} handleButtonRun={handleButtonRun} handleButtonClear={handleButtonClear} handleButtonReload={handleButtonReload}
              saveToFile={saveToFile} loadFromFile={loadFromFile} DownloadScreenShot={DownloadScreenShot} />
            <button onClick={installKeyboard}>Install Keyboard</button>
            <button onClick={resetKeyboard}>Reset Keyboard</button>
            <p>Keyboard Status: {keyboardStatus ? "True" : "False"}</p>
          </div>
          <ScreenViewer imageSrc={imageSrc} isLoading={isLoading} />
        </div>
      </header>
    </div>
  );
}

export default App;
