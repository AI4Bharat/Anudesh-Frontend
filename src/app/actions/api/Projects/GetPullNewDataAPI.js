/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
   /* eslint-disable react-hooks/exhaustive-deps */

 export default class GetPullNewDataAPI extends API {
    constructor(projectId, timeout = 2000) {
      super("POST", timeout, false);
      this.type = constant.GET_PULL_NEW_ITEMS;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/pull_new_items/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.pullNewData = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {}
   
  
    getHeaders() {
      this.headers = {
        headers: {
          "Content-Type": "application/json",
          "Authorization":`JWT ${localStorage.getItem('anudesh_access_token')}`
        },
      };
      return this.headers;
    }
  
    getPayload() {
      return this.pullNewData;
    }
  }
  