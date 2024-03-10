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

  useEffect(() => {
    setTaskItems([
      { id: 1, text: "Scroll" },
      { id: 2, text: "Click" },
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

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDrop = (event) => {
    const item = JSON.parse(event.dataTransfer.getData("text/plain"));
    setFlowItems([...flowItems, item]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleButtonClick = () => {
    console.log(JSON.stringify(flowItems));
  };

  const handleButtonClear = () => {
    setFlowItems([]);
  };

  const handleButtonReload = () => {
    ipcRenderer.send("screen");
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <TaskList taskItems={taskItems} handleDragStart={handleDragStart} />
            <FlowList flowItems={flowItems} handleDrop={handleDrop} handleDragOver={handleDragOver} />
            <ControlButtons handleButtonClick={handleButtonClick} handleButtonClear={handleButtonClear} handleButtonReload={handleButtonReload} />
          </div>
          <ScreenViewer imageSrc={imageSrc} isLoading={isLoading} />
        </div>
      </header>
    </div>
  );
}

export default App;
