import API from "../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../constants";

export default class PostChatStreamAPI extends API {
  constructor(ChatInteractionObj, timeout = 0) {
    super("POST", timeout, false);
    this.ChatInteractionObj = ChatInteractionObj;
    this.type = constants.POST_CHAT_INTERACTION;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}chat_output_stream`;
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
}
