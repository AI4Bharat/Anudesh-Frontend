'use client'
import API from "@/Constants/api";


const apiInstance = new API();
const endpoints = apiInstance.apiEndPointAuto();

const fetchParams = (endpoint, method = "GET", body = null) => {
    return {
        url: `${endpoints}${endpoint}`,
        options: {
            method: method,
            body,
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${window.localStorage.getItem('anudesh_access_token')}`,
            },
        }
    };
};

export default fetchParams;