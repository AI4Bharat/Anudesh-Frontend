import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
 
 export default class OrganizationAPI extends API {
   constructor(timeout = 2000) {
     super("GET", timeout, false);
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.org = res;
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
         "Authorization": `JWT ${localStorage.getItem("anudesh_access_token")}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.org
   }
 }
 