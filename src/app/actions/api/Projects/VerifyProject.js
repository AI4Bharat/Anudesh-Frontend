/**
 * Login API
 */
import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
import { Password } from "@mui/icons-material";

export default class VerifyProject extends API {
  constructor(id,password, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.ARCHIVE_WORKSPACE;
    this.password = password;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${id}/verify_password/`;
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
    password: this.password
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
