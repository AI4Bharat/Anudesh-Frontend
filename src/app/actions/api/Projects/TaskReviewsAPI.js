/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
  /* eslint-disable react-hooks/exhaustive-deps */

 export default class TaskReviewsAPI extends API {
   constructor(id,taskReviews, timeout = 2000) {
     super("POST", timeout, false);
     this.taskReviews = taskReviews;
     this.type = constant.TASK_REVIEWS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${id}/change_project_stage/`;
   } 
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.reviewRes = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return {
      project_stage: this.taskReviews,
    };
  }
 
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
         "Authorization": `JWT ${localStorage.getItem('anudesh_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.reviewRes;
   }
 }
 