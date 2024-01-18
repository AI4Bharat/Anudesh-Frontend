/**
 * Google Login API
 */
import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"


export default class GoogleLoginAPI extends API {
  constructor(token, timeout = 2000) {
    super("POST", timeout, false);
    this.token = token;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.googleLogin}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.report = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
        token: this.token
    };
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
    return this.report
  }
}
