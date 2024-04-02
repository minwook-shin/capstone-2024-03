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
    { text: "scroll_up", time: '' },
    { text: "scroll_down", time: '' },
    { text: "single_click", x: "{{_local['top_left_x']}}", y: "{{_local['top_left_y']}}", time: 1 },
    { text: "long_press", x: "{{_local['top_left_x']}}", y: "{{_local['top_left_y']}}", time: 1 },
    { text: "key_event", key_event: '', time: '' },
    { text: "delay", time: '' },
    { text: "loop", time: '', functions: [] },
    { text: "input_text", time: '', input_text: '' },
    { text: "screen_capture", time: '' },
    { text: "image_matching", time: 1, template: ''},
    { text: "extract_text", time: 1, top_left_x: "{{_local['top_left_x']}}", top_left_y: "{{_local['top_left_y']}}", bottom_right_x: "{{_local['bottom_right_x']}}", bottom_right_y: "{{_local['bottom_right_y']}}"},
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
