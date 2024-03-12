//glossary SuggestAnEdit
import API from "../../api"; 
 import ENDPOINTS from "../../../../config/apiendpoint"
 import constants from "../../constants";
 
export default class PostChatInteractionAPI extends API {
   constructor(ChatInteractionObj,timeout = 2000) {
     super("POST", timeout, false);
     this.ChatInteractionObj = ChatInteractionObj;
     this.type = constants.POST_CHAT_INTERACTION;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}chat_output`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.chatInteraction = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return this.ChatInteractionObj;
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
     return this.chatInteraction;
   }
 }
 