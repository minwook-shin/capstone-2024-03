import { useEffect, useState, useMemo } from "react";
import TaskList from './TaskList';
import FlowList from './FlowList';
import ScreenViewer from './ScreenViewer';
import VariableManager from "./VariableManager";
import { Container, Grid, Box } from '@mui/material';
import PrimaryAppBar from './PrimaryAppBar';
import "@fontsource/nanum-gothic";
import "@fontsource/nanum-gothic/400.css";
import Joyride from 'react-joyride';
import { steps } from './intro_step.js';

function App() {
  const [taskItems, setTaskItems] = useState([]);
  const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });
  const [dragCoords, setDragCoords] = useState({ top_left_x: 0, top_left_y: 0, bottom_right_x: 0, bottom_right_y: 0 });

  const [run, setRun] = useState(false);

  const initialTaskItems = useMemo(() => [
    { display_text: "위로 스크롤", text: "scroll_up", time: 1 },
    { display_text: "아래로 스크롤", text: "scroll_down", time: 1 },
    { display_text: "단일 클릭", text: "single_click", x: '', y: '', time: 1 },
    { display_text: "길게 클릭", text: "long_press", x: '', y: '', time: 1 },
    { display_text: "키 이벤트 입력", text: "key_event", key_event: '', time: 1 },
    { display_text: "지연 시간", text: "delay", time: 1 },
    { display_text: "반복 작업", text: "loop", time: 1, functions: [] },
    { display_text: "텍스트 키보드 입력", text: "input_text", time: 1, input_text: '' },
    { display_text: "안드로이드 화면 캡쳐", text: "screen_capture", time: 1 },
    { display_text: "이미지 위치 클릭", text: "image_matching", time: 1, template: '' },
    { display_text: "지정 범위 텍스트 추출", text: "extract_text", top_left_x: '', top_left_y: '', bottom_right_x: '', bottom_right_y: '', variable_name: '', time: 1 },
    { display_text: "시나리오 사용자 변수 부여", text: "user_variable", variable_name: '', variable_value: '', time: 1 },
    { display_text: "파이썬 스크립트 실행", text: "python_runner", time: 1, code: ''}
  ], []);

  useEffect(() => {

    setTaskItems(initialTaskItems);
  }, [initialTaskItems]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
    }
  };

  return (
    <div>
      <Joyride steps={steps} run={run}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton
        disableOverlay
        disableScrolling
        locale={{ back: '뒤로', close: '닫기', last: '마지막', next: '다음', open: '창 열기', skip: '넘기기' }}
         />
      <PrimaryAppBar className="menu_target" setRun={setRun}/>
      <Container>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} md={4}>
            <Box boxShadow={3} padding={1}>
              <TaskList taskItems={taskItems} className="task_list_target" />
            </Box>
            <Box boxShadow={3} padding={1} className="vm_target">
              <VariableManager />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box boxShadow={3} padding={1}>
              <FlowList taskItems={taskItems} initialTaskItems={initialTaskItems} dragCoords={dragCoords} clickCoords={clickCoords} className="flow_list_target" className2="control_target" />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Box boxShadow={3} padding={1}>
              <ScreenViewer setDragCoords={setDragCoords} setClickCoords={setClickCoords}  className="screen_target"/>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
