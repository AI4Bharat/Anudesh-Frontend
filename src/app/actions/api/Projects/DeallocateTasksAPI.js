/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
 
 export default class DeallocateTasksAPI extends API {
   constructor(projectId,selectedFilters, timeout = 2000) {
     super("POST", timeout, false);
     this.projectId = projectId;
     this.type = constant.DE_ALLOCATE_TASKS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_tasks/?annotation_status=['${selectedFilters}']`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.unassignRes = res;
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
     return this.unassignRes;
   }
 }
  