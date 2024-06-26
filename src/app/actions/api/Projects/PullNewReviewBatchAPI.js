/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
 
 export default class PullNewReviewBatchAPI extends API {
   constructor(projectId, numsTasks, timeout = 2000) {
     super("POST", timeout, false);
     this.projectId = projectId;
     this.numsTasks = numsTasks;
     this.type = constant.PULL_NEW_REVIEW_BATCH;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/assign_new_review_tasks/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.newTasks = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return { num_tasks: this.numsTasks };
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
 
   getPayload() {
     return this.newTasks;
   }
 }
  