import { useEffect, useState, useMemo } from "react";
import TaskList from './TaskList';
import FlowList from './FlowList';
import ScreenViewer from './ScreenViewer';
import VariableManager from "./VariableManager";
import { Container, Grid, Box } from '@mui/material';
import PrimaryAppBar from './PrimaryAppBar';


function App() {
  const [taskItems, setTaskItems] = useState([]);
  const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });
  const [dragCoords, setDragCoords] = useState({ top_left_x: 0, top_left_y: 0, bottom_right_x: 0, bottom_right_y: 0 });

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
    { text: "image_matching", time: 1, template: '' },
    { text: "extract_text", time: 1, top_left_x: '', top_left_y: '', bottom_right_x: '', bottom_right_y: '' },
    { text: "user_variable", time: 1, variable_name: '', variable_value: '' }
  ], []);

  useEffect(() => {

    setTaskItems(initialTaskItems);
  }, [initialTaskItems]);
  return (
    <body>
      <PrimaryAppBar />
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={4}>
            <Box boxShadow={3} padding={1}>
              <TaskList taskItems={taskItems} />
            </Box>
            <Box boxShadow={3} padding={1}>
              <VariableManager />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box boxShadow={3} padding={1}>
              <FlowList taskItems={taskItems} initialTaskItems={initialTaskItems} dragCoords={dragCoords} clickCoords={clickCoords} />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Box boxShadow={3} padding={1}>
              <ScreenViewer setDragCoords={setDragCoords} setClickCoords={setClickCoords} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </body>
  );
}

export default App;
