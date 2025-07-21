import axios from "axios";
import { BASE_URL } from "../constants.js";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use((config) => {
  try {
    const persistedRoot = localStorage.getItem("persist:root");
    if (persistedRoot) {
      const authState = JSON.parse(persistedRoot).auth;
      const userData = JSON.parse(authState).userData;

      const accessToken = userData?.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
  } catch (err) {
    console.error("Token extraction error", err);
  }

  return config;
});

export default axiosInstance;