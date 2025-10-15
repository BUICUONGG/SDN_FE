import { message } from "antd";

export function validatePhone(phone){
    const phoneRegex = /^((0|84|\+84)(3|5|7|8|9)[0-9]{8})$/;
    if(!phone){
        return{
            isValid : false,
            message: 'Vui lòng nhập số điện thoại.'
        }
    }

    if(!phoneRegex.test(phone)){
        return{
            isValid: false,
            message: 'Số điện thoại phải gồm đúng 10 chữ số và không chứa ký tự.'
        }
    }

    return{
        isValid: true,
        message: '',
    }
}