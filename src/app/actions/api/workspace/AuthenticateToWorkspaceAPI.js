import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
 /* eslint-disable react-hooks/exhaustive-deps */

export default class AuthenticateToWorkspaceAPI extends API {
  constructor(currentWorkspaceId, authenticateObj, timeout = 2000) {
    super("PUT", timeout, false);
    this.authenticateObj = authenticateObj;
    this.type = constants.AUTHENTICATE_WORKSPACE;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${currentWorkspaceId}/guest_auth/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.authenticateWorkspace = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
   return this.authenticateObj;
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
    return this.authenticateWorkspace 
  }
}
