import { useEffect, useState } from "react";
import './App.css';
import TaskList from './TaskList';
import FlowList from './FlowList';
import ControlButtons from './ControlButtons';
import ScreenViewer from './ScreenViewer';

function App() {
  const [taskItems, setTaskItems] = useState([]);

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
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <TaskList taskItems={taskItems} style={{ border: '1px solid black' }} />
            <FlowList taskItems={taskItems} style={{ border: '1px solid black' }} />
            <ControlButtons style={{ border: '1px solid black' }} />
          </div>
          <ScreenViewer style={{ border: '1px solid black' }} />
        </div>
      </header>
    </div>
  );
}

export default App;
