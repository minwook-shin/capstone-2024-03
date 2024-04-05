import { useEffect, useState, useMemo } from "react";
import './App.css';
import TaskList from './TaskList';
import FlowList from './FlowList';
import ControlButtons from './ControlButtons';
import ScreenViewer from './ScreenViewer';
import ManagerViewer from './ManagerViewer';
import VariableManager from "./VariableManager";

function App() {
  const [taskItems, setTaskItems] = useState([]);

  const initialTaskItems = useMemo(() => [
    { text: "scroll_up", time: 1 },
    { text: "scroll_down", time: 1 },
    { text: "single_click", x: '', y: '', time: 1 },
    { text: "long_press", x: '', y: '', time: 1 },
    { text: "key_event", key_event: '', time: 1 },
    { text: "delay", time: 1 },
    { text: "loop", time: 1, functions: [] },
    { text: "input_text", time: 1, input_text: '' },
    { text: "screen_capture", time: 1 },
    { text: "image_matching", time: 1, template: ''},
    { text: "extract_text", time: 1, top_left_x: '', top_left_y: '', bottom_right_x: '', bottom_right_y: ''},
    { text: "user_variable", time: 1, variable_name: '', variable_value: ''}
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
          <ManagerViewer />
          <ScreenViewer />
          <VariableManager />
        </div>
      </header>
    </div>
  );
}

export default App;
