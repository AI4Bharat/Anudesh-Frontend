import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
 
 export default class wsPeriodicalTasksAPI extends API {
   constructor(progressObj, wsId, metaInfo, timeout = 2000) {
     super("POST", timeout, false);
     this.progressObj = progressObj;
     this.type = constants.PERODICAL_TASK_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS. getWorkspaces}${wsId}/periodical_tasks_count/${metaInfo ? "?metainfo=true" : ""}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.PeriodicalTasks = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return this.progressObj;
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
     return this.PeriodicalTasks;
   }
 }
 