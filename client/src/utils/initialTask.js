import {
  CaretDoubleUp,
  CaretDoubleDown,
  CursorClick,
  Hockey,
  Timer,
  Infinity,
  TextT,
  CornersOut,
  ImagesSquare,
  ArticleNyTimes,
  FolderSimpleUser,
  FilePy,
  Power,
  AndroidLogo,
  SlackLogo,
  NotionLogo,
  GreaterThanOrEqual
} from "@phosphor-icons/react";

/**
 * 초기 작업 데이터를 정의합니다.
 */
export const initialTaskData = [
  { display_text: "위로 스크롤", text: "scroll_up", time: 1 },
  { display_text: "아래로 스크롤", text: "scroll_down", time: 1 },
  { display_text: "단일 클릭", text: "single_click", x: "", y: "", time: 1 },
  { display_text: "길게 클릭", text: "long_press", x: "", y: "", time: 1 },
  { display_text: "키 이벤트 입력", text: "key_event", key_event: "", time: 1 },
  { display_text: "지연 시간", text: "delay", time: 1 },
  { display_text: "반복 작업", text: "loop", time: 1, functions: [] },
  {
    display_text: "텍스트 키보드 입력",
    text: "input_text",
    time: 1,
    input_text: "",
  },
  { display_text: "안드로이드 화면 캡쳐", text: "screen_capture", time: 1 },
  {
    display_text: "이미지 위치 클릭",
    text: "image_matching",
    time: 1,
    template: "",
  },
  {
    display_text: "지정 범위 텍스트 추출",
    text: "extract_text",
    top_left_x: "",
    top_left_y: "",
    bottom_right_x: "",
    bottom_right_y: "",
    variable_name: "",
    time: 1,
  },
  {
    display_text: "사용자 변수 부여",
    text: "user_variable",
    variable_name: "",
    variable_value: "",
    time: 1,
  },
  {
    display_text: "파이썬 스크립트 실행",
    text: "python_runner",
    time: 1,
    code: "",
  },
  {
    display_text: "조건부 종료",
    text: "conditional_exit",
    condition_variable: "",
    condition_value: "",
  },
  {
    display_text: "ADB 명령어 실행",
    text: "adb_command",
    time: 1,
    command: "",
  },
  {
    display_text: "slack 메시지 전송",
    text: "slack_message",
    time: 1,
    incoming_webhook_url: "",
    message: "",
  },
  {
    display_text: "Notion 페이지 생성",
    text: "notion_page",
    time: 1,
    token: "",
    database_id: "",
    title: "",
    content: "",
  },
  { 
    display_text: "데이터 비교",
    text: "compare_data",
    time: 1,
    origin: "",
    target: "",
    expression: "",
    variable_name: "",
  }
];

export const icons = {
  scroll_up: CaretDoubleUp,
  scroll_down: CaretDoubleDown,
  single_click: CursorClick,
  long_press: CursorClick,
  key_event: Hockey,
  delay: Timer,
  loop: Infinity,
  input_text: TextT,
  screen_capture: CornersOut,
  image_matching: ImagesSquare,
  extract_text: ArticleNyTimes,
  user_variable: FolderSimpleUser,
  python_runner: FilePy,
  conditional_exit: Power,
  adb_command: AndroidLogo,
  slack_message: SlackLogo,
  notion_page: NotionLogo,
  compare_data: GreaterThanOrEqual,
};

const { ipcRenderer } = window;

/**
 * 도움말 버튼 클릭 시, 해당 작업에 대한 도움말 페이지를 엽니다.
 * @param {*} task 
 */
export function handleHelpClick(task) {
  let url =
    "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/intro/";
  if (task === "scroll_up" || task === "scroll_down") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/scroll/";
  }
  if (task === "single_click" || task === "long_press") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/click/";
  }
  if (task === "key_event") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/key_event/";
  }
  if (task === "loop") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/loop/";
  }
  if (task === "input_text") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/keyboard/";
  }
  if (task === "screen_capture") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/capture/";
  }
  if (task === "image_matching") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/click/";
  }
  if (task === "extract_text") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/text_extract/";
  }
  if (task === "user_variable") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/variable/";
  }
  if (task === "python_runner") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/python/";
  }
  if (task === "conditional_exit") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/exit/";
  }
  if (task === "slack_message" || task === "notion_page") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/report/";
  }
  if (task === "compare_data") {
    url =
      "https://minwook-shin.github.io/capstone-2024-03-web/docs/tutorial/compare_data/";
  }
  ipcRenderer.invoke("openHelpWindow", url);
}
