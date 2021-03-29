export function padding(num, length) {
    for (var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
}
export function NO(prefix, num) {
    let no = padding(num, 10);
    return prefix + no;
}