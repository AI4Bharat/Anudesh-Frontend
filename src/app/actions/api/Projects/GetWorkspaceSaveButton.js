/**
 * Login API
 */
 import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constant from "../../constants";
  /* eslint-disable react-hooks/exhaustive-deps */

 export default class GetWorkspaceSaveButtonAPI extends API {
   constructor(id,workspaceObj, timeout = 2000) {
     super("PUT", timeout, false);
     this.workspaceObj = workspaceObj;
     // this.type = constants.GET_SAVE_BUTTON;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${id}/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.saveButton= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return this.workspaceObj;
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
     return this.saveButton 
   }
 }
 