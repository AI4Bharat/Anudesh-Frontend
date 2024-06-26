/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
 /* eslint-disable react-hooks/exhaustive-deps */

export default class SuperCheckSettingsAPI extends API {
   constructor(projectId,projectObj, timeout = 2000) {
     super("PATCH", timeout, false);
     this.projectObj = projectObj;
    //  this.type = constants.REMOVE_PROJECT_MEMBER;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.superCheckSettings = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
     return this.projectObj;
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
     return this.superCheckSettings;
   }
 }
 