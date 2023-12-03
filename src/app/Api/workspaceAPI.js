// // pages/api/getWorkspace.js



// export default async function handler(req, res) {
//   // Your existing API code here
//   const getWorkspaceAPI = new GetWorkspaceAPI();
//   const response = await getWorkspaceAPI.makeRequest();

//   res.status(response.status).json(response.data);
// }

// class GetWorkspaceAPI extends API {
//   constructor(timeout = 2000) {
//     super("GET", timeout, false);
//     this.type = constant.GET_WORKSPACE_DATA;
//     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}`;
//   }

//   processResponse(res) {
//     super.processResponse(res);
//     if (res) {
//       this.workspace = res;
//     }
//   }

//   apiEndPoint() {
//     return this.endpoint;
//   }

//   getBody() {}

//   getHeaders() {
//     this.headers = {
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
//       },
//     };
//     return this.headers;
//   }

//   getPayload() {
//     return this.workspace;
//   }
// }
