'use client'
import config from '../config/config';

const fetchParams = (endpoint, method = "GET", body = null) => {
    return {
        url: `${config.BASE_URL_AUTO}${endpoint}`,
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