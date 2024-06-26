// import { message } from "antd";
'use client'
  /* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
// import {  apiData } from "./apiData";
import configs from "../../config/config"


const ACCESS_TOKEN = "anudesh_access_token";
const REFRESH_TOKEN = "anudesh_refresh_token";
const TOKEN_NOT_VALID = "token_not_valid";

const REFRESH_URL = "users/auth/jwt/refresh"
const VERIFY_URL = "users/auth/jwt/verify";

let headers = {
  "Content-Type": "application/json",
  accept: "application/json",
};

if (typeof window !== "undefined") {
  headers.Authorization = `JWT ${window.localStorage.getItem(ACCESS_TOKEN)}`;
}


const axiosInstance = axios.create({
  baseURL: configs.BASE_URL_AUTO,
  timeout: 500000,
  headers,
  validateStatus: (status) => {
    return true;
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = localStorage.getItem(ACCESS_TOKEN)
      ? `JWT ${localStorage.getItem(ACCESS_TOKEN)}`
      : null;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (typeof error.response === "undefined") {
      alert("Unknown server error!");
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === configs.BASE_URL + REFRESH_URL
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === TOKEN_NOT_VALID &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        // const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        // const now = Math.ceil(Date.now() / 1000);

        const data = await axiosInstance.post(VERIFY_URL, {
          token: refreshToken,
        });

        if (data.status === 200) {
          return axiosInstance
            .post(REFRESH_URL, {
              refresh: refreshToken,
            })
            .then((response) => {
              localStorage.setItem(ACCESS_TOKEN, response.data.access);
              localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              // message.alert("Error refreshing token.");
              return err;
            });
        } else if (data.response.status !== 200) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          localStorage.removeItem("email_id");
          window.location.pathname = "/login";
        } else {
          window.location.href = "/";
        }
      } else {
        // window.location.href = "/";
      }

      return Promise.reject(error);
    }
    if (error.response.status === 404) {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;