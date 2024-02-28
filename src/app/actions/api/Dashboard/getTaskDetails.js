/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
 /* eslint-disable react-hooks/exhaustive-deps */

 export default class GetTaskDetailsAPI extends API {
   constructor(taskId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constant.GET_TASK_DETAILS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${taskId}/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.taskDetails = res;
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
     return this.taskDetails
   }
 }
 