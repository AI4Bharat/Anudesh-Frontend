// This file is not used anywhere right now. If needed be can be removed in future as requirements change.
import API from "@/Constants/api";
import ENDPOINTS from "../../../config/apiendpoint"
import constants from "@/Constants/constants";

export default class UpdateUIPrefsAPI extends API {
    constructor(timeout = 2000) {
        super("POST", timeout, false);
        this.type = constants.UPDATE_UI_PREFS;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}update_ui_prefs/`;
    }

    processResponse(res) {
        super.processResponse(res);
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {};
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
        return {};
    }
}
