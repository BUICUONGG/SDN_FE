export const validateName = (name) => {
    // Kiểm tra độ dài tối thiểu 12 ký tự
    if (name.length < 12) {
        return { isValid: false, message: "Tên phải có ít nhất 12 ký tự." };
    }

    // Kiểm tra ký tự đặc biệt (chỉ cho phép chữ và số)
    const specialCharRegex = /^[a-zA-Z0-9 ]+$/;
    if (!specialCharRegex.test(name)) {
        return { isValid: false, message: "Tên không được chứa ký tự đặc biệt." };
    }

    // Nếu hợp lệ
    return { isValid: true, message: "Tên hợp lệ." };
};
