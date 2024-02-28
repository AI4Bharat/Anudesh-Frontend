import API from "../../api"; 
import ENDPOINTS from "../../../../config/apiendpoint"
import constants from "../../constants";
/* eslint-disable react-hooks/exhaustive-deps */

export default class PatchAnnotationAPI extends API {
 constructor(annotationId,annotationObj,timeout = 2000) {
   super("PATCH", timeout, false);
   this.annotationObj = annotationObj;
   this.type = constants.PATCH_ANNOTATIONS;
   this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.annotations}${annotationId}/`;
 }

 processResponse(res) {
   super.processResponse(res);
   if (res) {
    this.patchAnnotation = res;
   }
}

 apiEndPoint() {
   return this.endpoint;
 }

 getBody() {
   return this.annotationObj;
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
   return this.patchAnnotation
 }
}
