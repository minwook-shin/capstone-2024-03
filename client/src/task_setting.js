import { base64ToArrayBuffer } from "./utils/converter.js";
const API_URL = "http://127.0.0.1";

/**
 * api 호출 함수
 * @param {*} url
 * @param {*} method
 * @param {*} body
 * @returns
 */
const apiCall = async (url, method, body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}/${url}`, options);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

/**
 * task setting 에 따라 api 데이터 담고 호출
 * @param {*} newItem
 * @param {*} initialTaskItems
 * @returns
 */
export const add_task_setting = async (newItem, initialTaskItems) => {
  const task_id = Date.now();
  const time = parseInt(newItem.time, 10);
  if (initialTaskItems.map((item) => item.text).includes(newItem.text)) {
    const body = { time, task_id };
    if (newItem.text === "single_click") {
      body.x = isNaN(parseInt(newItem.x, 10))
        ? newItem.x
        : parseInt(newItem.x, 10);
      body.y = isNaN(parseInt(newItem.y, 10))
        ? newItem.y
        : parseInt(newItem.y, 10);
    } else if (newItem.text === "key_event") {
      body.key_event = newItem.key_event;
    } else if (newItem.text === "loop") {
      body.functions = newItem.functions;
      body.time = newItem.time;
    } else if (newItem.text === "input_text") {
      body.input_text = newItem.input_text;
    } else if (newItem.text === "long_press") {
      body.x = isNaN(parseInt(newItem.x, 10))
        ? newItem.x
        : parseInt(newItem.x, 10);
      body.y = isNaN(parseInt(newItem.y, 10))
        ? newItem.y
        : parseInt(newItem.y, 10);
    } else if (newItem.text === "image_matching") {
      const formData = new FormData();
      const blob = new Blob([newItem.template], { type: "image/png" });
      formData.append("template", blob, "template.png");
      formData.append("task_id", task_id);

      fetch(`${API_URL}/image_matching`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      return;
    } else if (newItem.text === "extract_text") {
      body.top_left_x = isNaN(parseInt(newItem.top_left_x, 10))
        ? newItem.top_left_x
        : parseInt(newItem.top_left_x, 10);
      body.top_left_y = isNaN(parseInt(newItem.top_left_y, 10))
        ? newItem.top_left_y
        : parseInt(newItem.top_left_y, 10);
      body.bottom_right_x = isNaN(parseInt(newItem.bottom_right_x, 10))
        ? newItem.bottom_right_x
        : parseInt(newItem.bottom_right_x, 10);
      body.bottom_right_y = isNaN(parseInt(newItem.bottom_right_y, 10))
        ? newItem.bottom_right_y
        : parseInt(newItem.bottom_right_y, 10);
      body.variable_name = newItem.variable_name;
    } else if (newItem.text === "user_variable") {
      body.variable_name = newItem.variable_name;
      body.variable_value = newItem.variable_value;
    } else if (newItem.text === "python_runner") {
      body.code = newItem.code;
    } else if (newItem.text === "conditional_exit") {
      body.condition_variable = newItem.condition_variable;
      body.condition_value = newItem.condition_value;
    } else if (newItem.text === "adb_command") {
      body.command = newItem.command;
    } else if (newItem.text === "slack_message") {
      body.incoming_webhook_url = newItem.incoming_webhook_url;
      body.message = newItem.message;
    } else if (newItem.text === "notion_page") {
      body.token = newItem.token;
      body.database_id = newItem.database_id;
      body.title = newItem.title;
      body.content = newItem.content;
    }
    const jsonResponse = await apiCall(newItem.text, "POST", body);
    console.log(jsonResponse);
  }
};

/**
 * 백업을 복원할 때 정해진 데이터 형식에 맞게 api 호출
 * @param {*} newFlowItems
 */
export const add_backup_setting = async (newFlowItems) => {
  for (const item of newFlowItems) {
    const { text, ...rest } = item;
    const task_id = Date.now();

    if (text === "image_matching") {
      const formData = new FormData();
      const blob = new Blob([base64ToArrayBuffer(rest.template)], {
        type: "image/png",
      });
      formData.append("template", blob, "template.png");
      formData.append("task_id", task_id.toString());

      await fetch(`${API_URL}/image_matching`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    } else {
      await fetch(`${API_URL}/${text}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...rest, task_id }),
      });
    }
  }
};
