import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "secret_key";

export const encryptData = (data) => {
    if (!data) {
        console.error( data);
        return null;
    }

    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const decryptData = (encryptedData) => {
    if (!encryptedData) {
        console.error( encryptedData);
        return null;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error("Lỗi giải mã decryptData:", error);
        return null;
    }
};
