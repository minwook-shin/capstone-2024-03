/**
 * API 요청을 보내는 함수 모음
 * GET, POST, DELETE 함수를 제공
 * @param {*} url
 * @param {*} method
 * @param {*} data
 * @param {*} isJson
 * @returns
 */
async function fetchWithMethod(url, method, data = null, isJson = true) {
  const headers = isJson
    ? { "Content-Type": "application/json" }
    : { "Content-Type": "application/x-www-form-urlencoded" };
  const body = isJson ? JSON.stringify(data) : new URLSearchParams(data);

  const options = {
    method,
    headers,
    ...(data && { body }),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return response;
    }
  } catch (err) {
    return err;
  }
}

/**
 * GET 요청을 보내는 함수
 * @param {*} url
 * @returns
 */
function get(url) {
  return fetchWithMethod(url, "GET");
}

/**
 * POST 요청을 보내는 함수
 * @param {*} url
 * @param {*} data
 * @param {*} isJson
 * @returns
 */
function post(url, data, isJson = true) {
  return fetchWithMethod(url, "POST", data, isJson);
}

/**
 * DELETE 요청을 보내는 함수
 * @param {*} url
 * @returns
 */
function del(url) {
  return fetchWithMethod(url, "DELETE");
}

export const api = {
  get,
  post,
  del,
};
