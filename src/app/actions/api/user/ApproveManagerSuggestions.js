/**
 * ApproveManagerSuggestions API
 */
import API from "../../api";
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";

export default class ApproveManagerSuggestions extends API {
   constructor(userId, timeout = 2000) {
     super("PATCH", timeout, false);
     this.type = constants.APPROVE_MANAGER_SUGGESTIONS;
     this.userId = userId;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.inviteUsers}approve_user/?userId=${this.userId}`;
   }

   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.approveManagerSuggestions = res;
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
         "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }

   getPayload() {
     return this.approveManagerSuggestions;
   }
 }