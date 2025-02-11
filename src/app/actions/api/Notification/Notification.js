/**
 * GetOragnizationUsers API
 */
import API from "../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../constants";
 
export default class NotificationAPI extends API {
   constructor( timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.NOTIFICATION;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.notification}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.notification = res;
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
         "Authorization":`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3ODA3ODExLCJqdGkiOiJiODFkZThlMGNmNjI0NTQ3YTc3ZmUxZWMxOWVhNDcxOCIsInVzZXJfaWQiOjJ9.5CrxEkcoI2hqPtOAHesxGZaEl9rRi52fQcISftaGfjw`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.notification;
   }
 }
 