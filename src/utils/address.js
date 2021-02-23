export function parseAddress(addr) {
    if (addr != undefined) {
        return addr.replace(/-/g, "");
    }
    return "";
}