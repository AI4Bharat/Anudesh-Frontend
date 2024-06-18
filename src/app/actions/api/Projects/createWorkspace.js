/**
 * Login API
 */
import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";

export default class CreateGuestWorkspace extends API {
  constructor(workspaceId,workspacePassword ,timeout = 2000) {
    super("PATCH", timeout, false);
    this.workspace_password = workspacePassword
    this.type = constants.ARCHIVE_WORKSPACE;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/edit_workspace/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.editworkspace= res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
   return  {
    workspace_password:this.workspace_password,
    guest_workspace: true
   }
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
    return this.archiveworkspace;
  }
}
