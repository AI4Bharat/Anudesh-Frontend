
import API from "@/Constants/api";
import ENDPOINTS from "../../../config/apiendpoint"
import constants from "@/Constants/constants";

export default class UpdateUIPrefsAPI extends API {
    /**
     * @param {Object} payload - Any subset of:
     *   { prefer_cl_ui, instruction_panel_width, annotation_font_size, instruction_panel_pinned }
     */
    constructor(payload, timeout = 2000) {
        super("POST", timeout, false);
        this.payload = typeof payload === "boolean"
            ? { prefer_cl_ui: payload }  // backward-compat: old callers pass a bool directly
            : payload;
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
        return this.payload;
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
        return this.payload;
    }
}
