//glossary SuggestAnEdit
import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constants from "../../constants";
 
export default class PostChatLogAPI extends API {
   constructor(ChatLogObj,timeout = 2000) {
     super("POST", timeout, false);
     this.ChatLogObj = ChatLogObj;
     this.type = constants.POST_CHAT_LOG;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}chat_log`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.chatLog = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return this.ChatLogObj;
  }
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.chatLog;
   }
 }
 