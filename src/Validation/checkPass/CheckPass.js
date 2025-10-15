import { message } from "antd";

export function validatePass(pass){
    const passRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])(?=.{8,})/;
    if(!pass){
        return{
            isValid : false,
            message: 'Vui lòng nhập mã xác minh nếu chưa có vui lòng yêu cầu gửi mã.'
        }
    }

    if(!passRegex.test(pass)){
        return{
            isValid: false,
            message: 'Mã xác minh phải bao gồm 6 ký tự.'
        }
    }

    return{
        isValid: true,
        message: '',
    }
}