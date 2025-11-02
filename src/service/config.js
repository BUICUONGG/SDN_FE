import axios from "axios";
import { localUserService } from "./localService";

export const BASE_URL = process.env.REACT_APP_BASE_URL2;
export const BASE_URL2 = process.env.REACT_APP_BASE_URL2;

console.log("🔗 BASE_URL:", BASE_URL);

export const configHeader = () => {
    const accessToken = localUserService.getAccessToken();
    return {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
    };
};


// Tạo Axios instance
export const https = axios.create({
    baseURL: BASE_URL,
});


// Kích hoạt interceptor
https.interceptors.request.use(
    (config) => {
        const authExcludedUrls = [
            "/register",
            "/login",
            "/oauth2/authorization",
            "/user-service/v1/account/confirm-otp",
            "/user-service/v1/account/resend-otp",
            "/user-service/v1/account/forgot-password",
            "/user-service/v1/account/reset-password",
        ];
        const isExcluded = authExcludedUrls.some((url) => config.url.includes(url));

        if (!isExcluded) {
            config.headers = { ...config.headers, ...configHeader() };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
