import {  userService } from "../../service/userService";
import { USER_LOGIN,  USER_SIGNUP} from "../contant/useContant"
import { localUserService } from "../../service/localService"


export const setLoginAction = (value) =>{
    return {
        type: USER_LOGIN,
        payload: value,
    }
};

export const setSignUpAction = (value) =>{
    return{
        type: USER_SIGNUP,
        payload: value,
    }
};

export const setLoginActionService =( value, onCompleted)  =>{
    return(dispatch) =>{
        userService.postLogin(value)
                .then((res) =>{
                    console.log(res);
                    dispatch({
                        type: USER_LOGIN,
                        payload: res.data.content,
                    });
                    localUserService.set(res.data.content);
                    onCompleted();
                })
                .catch((err) =>{
                    console.log(err);
                })
    }
}

export const setSignUpActionService =( value, onCompleted)  =>{
    return(dispatch) =>{
        userService.postSignUp(value)
                .then((res) =>{
                    // console.log(res);
                    dispatch({
                        type: USER_SIGNUP,
                        payload: res.data.content,
                    });
                    localUserService.set(res.data.content);
                    onCompleted();
                })
                .catch((err) =>{
                    console.log(err);
                })
    }
}