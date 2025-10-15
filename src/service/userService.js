import axios from "axios";
import { BASE_URL } from "./config";

export const userService = {
    postLogin: (loginForm) => {
        return axios.post(`${BASE_URL}/user-service/api/v1/account/login`, loginForm, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    },

    postSignUp: (signUpForm) => {
        return axios.post(`${BASE_URL}/user-service/api/v1/account/signup`, signUpForm, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
