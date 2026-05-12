/**
 * Login API
 */
import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constant from "../../constants";
/* eslint-disable react-hooks/exhaustive-deps */

export default class DeallocationAnnotatorsAndReviewersAPI extends API {
  constructor(projectId, radiobutton, annotatorsUser, reviewerssUser, annotationStatus, reviewStatus, superCheckUser, SuperCheckStatus, taskIdsArray, taskIdStatusArray = [], taskIdStatusType = "annotation", timeout = 2000) {
    super("POST", timeout, false);
    
    let endpoint = "";
    let body = {};
    
    // Handle taskIds deallocation with status
    if (radiobutton === "taskIds") {
      endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_tasks/`;
      body = { task_ids: taskIdsArray };
      
      // Add status filter if provided
      if (taskIdStatusArray && taskIdStatusArray.length > 0) {
        body.annotation_status = taskIdStatusArray;
      }
    } 
    // Handle annotation deallocation
    else if (radiobutton === "annotation") {
      endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_tasks/?annotator_id=${annotatorsUser}&annotation_status=["${annotationStatus}"]`;
      body = {};
    } 
    // Handle review deallocation
    else if (radiobutton === "review") {
      endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_review_tasks/?reviewer_id=${reviewerssUser}&review_status=["${reviewStatus}"]`;
      body = {};
    } 
    // Handle supercheck deallocation
    else if (radiobutton === "superChecker") {
      endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/unassign_supercheck_tasks/?superchecker_id=${superCheckUser}&supercheck_status=["${SuperCheckStatus}"]`;
      body = {};
    }
    
    this.endpoint = endpoint;
    this.body = body;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.deallocationAnnotatorsAndReviewers = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }
  
  getBody() {
    return this.body;
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
    return this.deallocationAnnotatorsAndReviewers;
  }
}
