import { encryptData, decryptData } from "./cryptoService";

export const localUserService = {
    get: () => {
        let encryptedData = localStorage.getItem("USER_INFO");
        return encryptedData ? decryptData(encryptedData) : null;
    },

    set: (userInfo) => {
        if (userInfo) {
            const { metadata } = userInfo;

            if (metadata.accessToken && metadata.refreshToken) {
                // Mã hóa accessToken và refreshToken trước khi lưu
                const encryptedAccessToken = encryptData(metadata.accessToken);
                const encryptedRefreshToken = encryptData(metadata.refreshToken);

                localStorage.setItem("ACCESS_TOKEN", encryptedAccessToken);
                localStorage.setItem("REFRESH_TOKEN", encryptedRefreshToken);
            } else {
                console.warn("Thiếu accessToken hoặc refreshToken");
            }

            // Mã hóa toàn bộ USER_INFO trước khi lưu
            const encryptedUserInfo = encryptData(metadata);
            localStorage.setItem("USER_INFO", encryptedUserInfo);
        } else {
            console.error("Dữ liệu đăng nhập không hợp lệ:", userInfo);
        }
    },

    getAccessToken: () => {
        const encryptedToken = localStorage.getItem("ACCESS_TOKEN");
        return encryptedToken ? decryptData(encryptedToken) : null;
    },

    getRefreshToken: () => {
        const encryptedToken = localStorage.getItem("REFRESH_TOKEN");
        return encryptedToken ? decryptData(encryptedToken) : null;
    },

    remove: () => {
        console.log("Xóa dữ liệu người dùng");
        localStorage.removeItem("USER_INFO");
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("REFRESH_TOKEN");
    }
};
