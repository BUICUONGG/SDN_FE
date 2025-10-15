import { localUserService } from "../../service/localService"
import { USER_LOGIN } from "../contant/useContant"

const initialState = {
    userInfo: localUserService.get(),
};

let userReducer = (state = initialState, {type, payload}) =>{
    switch (type) {
        case USER_LOGIN: {
            return{...state, userInfo: payload};
        }
        default:
            return state;
    }
}

export default userReducer
