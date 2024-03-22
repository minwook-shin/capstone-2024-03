import { useEffect, useState, useMemo } from "react";
import './App.css';
import TaskList from './TaskList';
import FlowList from './FlowList';
import ControlButtons from './ControlButtons';
import ScreenViewer from './ScreenViewer';

function App() {
  const [taskItems, setTaskItems] = useState([]);

  const initialTaskItems = useMemo(() => [
    { text: "scroll_up", time: '' },
    { text: "scroll_down", time: '' },
    { text: "single_click", x: '', y: '', time: '' },
    { text: "long_press", x: '', y: '', time: '' },
    { text: "short_cut", key_event: '', time: '' },
    { text: "delay", time: '' },
    { text: "iteration", time: '', functions: [] },
    { text: "input_text", time: '', input_text: '' },
    { text: "screen_capture", time: '' }
  ], []);

  useEffect(() => {

    setTaskItems(initialTaskItems);
  }, [initialTaskItems]);
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div>
            <TaskList taskItems={taskItems} />
            <FlowList taskItems={taskItems}  initialTaskItems={initialTaskItems}/>
            <ControlButtons />
          </div>
          <ScreenViewer />
        </div>
      </header>
    </div>
  );
}

export default App;
