export function formatDate(date) {
    return date.getFullYear() + "/" + formatNumber(date.getMonth() + 1) + "/" + formatNumber(date.getDate()) + " " +
        formatNumber(date.getHours()) + ":" + formatNumber(date.getMinutes()) + ":" + formatNumber(date.getSeconds());
}

export function formatOnlyDate(date) {
    return date.getFullYear() + "/" + formatNumber(date.getMonth() + 1) + "/" + formatNumber(date.getDate());
}
const formatNumber = (num) => {
    num = num.toString()
    return num[1] ? num : '0' + num
}