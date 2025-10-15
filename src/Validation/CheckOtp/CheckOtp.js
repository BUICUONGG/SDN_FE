import { message } from "antd";

export function validateOtp(otp){
    const otpRegex = /^[0-9]{6}$/;
    if(!otp){
        return{
            isValid : false,
            message: 'Vui lòng nhập mã xác minh nếu chưa có vui lòng yêu cầu gửi mã.'
        }
    }

    if(!otpRegex.test(otp)){
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