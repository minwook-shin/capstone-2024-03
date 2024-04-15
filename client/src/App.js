import { useEffect, useState, useMemo } from "react";
import TaskList from "./components/TaskList.js";
import FlowList from "./components/FlowList.js";
import ScreenViewer from "./components/ScreenViewer.js";
import VariableManager from "./components/VariableManager.js";
import { Container, Grid, Box } from "@mui/material";
import PrimaryAppBar from "./components/PrimaryAppBar.js";
import "@fontsource/nanum-gothic";
import "@fontsource/nanum-gothic/400.css";
import Joyride from "react-joyride";
import { steps } from "./utils/intro_step.js";
import { initialTaskData } from "./utils/initialTask.js";

function App() {
  const [taskItems, setTaskItems] = useState([]);
  const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });
  const [dragCoords, setDragCoords] = useState({
    top_left_x: 0,
    top_left_y: 0,
    bottom_right_x: 0,
    bottom_right_y: 0,
  });

  const [run, setRun] = useState(false);

  /**
   * 초기 작업 데이터 (useMemo : 고정된 데이터를 사용할 때 사용하면 성능 최적화에 도움이 됨)
   */
  const initialTaskItems = useMemo(() => initialTaskData, []);

  useEffect(() => {
    setTaskItems(initialTaskItems);
  }, [initialTaskItems]);

  /**
   * Joyride 콜백 함수
   * 완료하거나 건너뛸 때 닫을 수 있도록 설정
   */
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (status === "finished" || status === "skipped") {
      setRun(false);
    }
  };

  return (
    <div>
      <Joyride
        steps={steps}
        run={run}
        callback={handleJoyrideCallback}
        continuous
        showProgress
        showSkipButton
        disableOverlay
        disableScrolling
        locale={{
          back: "뒤로",
          close: "닫기",
          last: "마지막",
          next: "다음",
          open: "창 열기",
          skip: "넘기기",
        }}
      />
      <PrimaryAppBar className="menu_target" setRun={setRun} />
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
              <FlowList
                taskItems={taskItems}
                initialTaskItems={initialTaskItems}
                dragCoords={dragCoords}
                clickCoords={clickCoords}
                className="flow_list_target"
                className2="control_target"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Box boxShadow={3} padding={1}>
              <ScreenViewer
                setDragCoords={setDragCoords}
                setClickCoords={setClickCoords}
                className="screen_target"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
