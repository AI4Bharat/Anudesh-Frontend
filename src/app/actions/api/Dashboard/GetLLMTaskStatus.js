import API from "../../api";

export default class GetLLMTaskStatusAPI extends API {
  constructor(celeryTaskId, timeout = 0) {
    super("GET", timeout, false);
    this.endpoint = `${super.apiEndPointAuto()}/annotation/llm_task_status/${celeryTaskId}/`;
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("anudesh_access_token")}`,
      },
    };
    return this.headers;
  }
}
