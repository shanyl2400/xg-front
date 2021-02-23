export function hideTelephone(number) {
    var regPhone = /^(\d{3})\d{4}(\d{4})$/;
    return number.trim().replace(regPhone, "$1****$2");
}