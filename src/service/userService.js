import axios from "axios";
import { BASE_URL, BASE_URL2 } from "./config";

export const userService = {
    postLogin: (loginForm) => {
        console.log(loginForm)
        return axios.post(`${BASE_URL2}/login`, loginForm, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    },

    postSignUp: (signUpForm) => {
        return axios.post(`${BASE_URL2}/register`, signUpForm, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
