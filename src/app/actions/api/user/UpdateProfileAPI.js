import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
 /* eslint-disable react-hooks/exhaustive-deps */


export default class UpdateProfileAPI extends API {
    constructor(username, first_name, last_name, languages, phone,qualification,address,state,pin_code,age,city,gender,availability_status, participation_type, timeout = 2000) {
      super("POST", timeout, false);
      this.username = username;
      this.first_name = first_name;
      this.last_name = last_name;
      this.languages = languages;
      this.phone = phone;
      this.qualification=qualification,
      this.address = address,
      this.state = state,
      this.pin_code=pin_code,
      this.age = age,
      this.city = city,
      this.gender = gender,
      this.availability_status = availability_status;
      this.participation_type = participation_type;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}update/`;
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
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        languages: this.languages,
        phone: this.phone,
        qualification:this.qualification,
      address : this.address,
      state : this.state,
      pin_code:this.pin_code,
      age : this.age,
      city : this.city,
      gender:this.gender,
        availability_status:this.availability_status,
        participation_type :this.participation_type
      };
    }
  
    getHeaders() {
      this.headers = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem("anudesh_access_token")}`
        },
      };
      return this.headers;
    }
  
    getPayload() {
      return this.report
    }
  }
  