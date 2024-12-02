/**
 * GetTaskDetails
 */

import API from "@/app/actions/api"
import ENDPOINTS from "@/config/apiendpoint"
import constants from "@/Constants/constants";

const initialState = {
  data: [],
};

export const getQueuedTaskDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.GET_QUEUED_TASK_DETAILS:
      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
};
export default class GetQueuedTaskDetailsAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_QUEUED_TASK_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}/tasks/get_celery_tasks`;
    this.taskId = taskId;
  }
  async call() {
    try {
      const url = this.taskId
      ? `${this.apiEndPoint()}?task_id=${this.taskId}`
      : this.apiEndPoint();
      const response = await fetch(url, {
        method: this.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("anudesh_access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }

      const data = await response.json();
      return {
        type: this.type,
        payload: data,
      };
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.queuedTaskDetails = res;
    }
    return this.getActionPayload(); 
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return null; 
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization":`JWT ${localStorage.getItem('anudesh_access_token')}`
      },
    };
    return this.headers;
  }

  getActionPayload() {
    const action = {
      type: this.type,
      payload: this.queuedTaskDetails,
    };
    return action;
  }
}
