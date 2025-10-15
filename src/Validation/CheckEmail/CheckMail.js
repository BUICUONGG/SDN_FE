export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return { isValid: false, message: 'Email không được để trống.' };
    } 
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Email không đúng định dạng.' };
    }

    return { isValid: true, message: '' };
}
