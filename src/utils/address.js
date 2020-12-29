export function parseAddress(addr) {
    console.log(addr);
    if (addr != undefined) {
        return addr.replace(/-/g, "");
    }
    return "";
}