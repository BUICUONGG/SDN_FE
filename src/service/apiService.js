import axios from "axios";
import jwtDecode from "jwt-decode";
import { localUserService } from "./localService";
import { BASE_URL } from "./config";

const isTokenExpired = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
};

const https = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

https.interceptors.request.use(async (config) => {
    let accessToken = localUserService.getAccessToken();
    console.log("Access Token trước khi gửi request:", accessToken);

    if (isTokenExpired(accessToken)) {
        console.log("Token hết hạn, đang làm mới...");
        const refreshToken = localUserService.getRefreshToken();

        if (refreshToken) {
            try {
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                accessToken = response.data.accessToken;
                localUserService.set({ accessToken });

                console.log("Đã làm mới token!");
            } catch (error) {
                console.error("Làm mới token thất bại, đăng xuất...");
                localUserService.remove();
                window.location.href = "/";
                return Promise.reject(error);
            }
        }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

export default https;
