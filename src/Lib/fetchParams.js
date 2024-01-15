'use client'

const fetchParams = (endpoint, method = "GET", body = null) => {
    return {
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
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