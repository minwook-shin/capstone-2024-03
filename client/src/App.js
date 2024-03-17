import { useEffect, useState } from "react";
import './App.css';
import TaskList from './TaskList';
import FlowList from './FlowList';
import ControlButtons from './ControlButtons';
import ScreenViewer from './ScreenViewer';


const { ipcRenderer } = window;

function App() {
  const [taskItems, setTaskItems] = useState([]);

  const [flowItems, setFlowItems] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [inputVisible, setInputVisible] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

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
    const reader = new FileReader();

    reader.onload = async (event) => {
      const flowItems = JSON.parse(event.target.result).flowItems;
      setFlowItems(flowItems);

      const newFlowItems = flowItems.map(item => {
        const { id, time, ...rest } = item;
        return { ...rest, time: parseInt(time, 10) };
      });

      for (const item of newFlowItems) {
        const { text, ...rest } = item;
        await fetch(`http://127.0.0.1/${text}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...rest, task_id: Math.floor(Math.random() * 10000) }),
        });
      }
    };

    reader.readAsText(file);
  };

  const taskMetadata = {
    scroll_up: { time: null },
    scroll_down: { time: null },
    single_click: { x: null, y: null },
  };

  useEffect(() => {
    setTaskItems([
      { id: 1, text: "scroll_up", time: 1 },
      { id: 2, text: "scroll_down", time: 1 },
      { id: 3, text: "single_click", x: 0, y: 0 },
    ]);

    setIsLoading(true);
    ipcRenderer.send("screen");
    ipcRenderer.on("screen", (event, args) => {
      const blob = new Blob([args.screen], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
      setIsLoading(false);
    });
  }, []);

  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const item = { id: data.id, text: data.text };
    setInputVisible(true);
    setPendingItem(item);
    setInputValues(taskMetadata[data.text] || {});
  };

  const onInputChange = (event) => {
    setInputValues({
      ...inputValues,
      [event.target.name]: event.target.value,
    });
  };

  const onInputConfirm = async () => {
    const newItem = { ...pendingItem, ...inputValues };
    setFlowItems([...flowItems, newItem]);
    setInputVisible(false);
    setPendingItem(null);
    if (newItem.text === 'scroll_up') {
      const response = await fetch('http://127.0.0.1/scroll_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "time": parseInt(newItem.time, 10), "task_id": Math.floor(Math.random() * 10000) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    }
    if (newItem.text === 'scroll_down') {
      const response = await fetch('http://127.0.0.1/scroll_down', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "time": parseInt(newItem.time, 10), "task_id": Math.floor(Math.random() * 10000) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonResponse = await response.json();
      console.log(jsonResponse);
    }
    if (newItem.text === 'single_click') {
      console.log(JSON.stringify({ "x": parseInt(newItem.x, 10), "y": parseInt(newItem.y, 10), "task_id": Math.floor(Math.random() * 10000) }));
      // 다중 입력창 구현을 위해서 임시 작업된 조건문, 미구현됨ç
    }
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
    const response = await fetch('http://127.0.0.1/run', {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonResponse = await response.json();
    console.log(jsonResponse);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            {inputVisible && Object.entries(inputValues).map(([key, value]) => (
              <input
                key={key}
                type="text"
                name={key}
                value={value}
                onChange={onInputChange}
                placeholder={`Enter ${key}`}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    onInputConfirm();
                  }
                }}
              />
            ))}

            <TaskList taskItems={taskItems} handleDragStart={handleDragStart} />
            <FlowList flowItems={flowItems} onDrop={onDrop} handleDragOver={handleDragOver} />

            <ControlButtons handleButtonClick={handleButtonClick} handleButtonRun={handleButtonRun} handleButtonClear={handleButtonClear} handleButtonReload={handleButtonReload} 
              saveToFile={saveToFile} loadFromFile ={loadFromFile}/>
          </div>
          <ScreenViewer imageSrc={imageSrc} isLoading={isLoading} />
        </div>
      </header>
    </div>
  );
}

export default App;
