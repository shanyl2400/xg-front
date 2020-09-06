
export function checkAuthorities(auths) {
    for(let i = 0; i < auths.length; i ++){
        if(checkAuthority(auths[i])){
            return true;
        }
    }
    return false;
}

export function checkAuthority(auth) {
    let permission = sessionStorage.getItem("auths");
    let index = permission.indexOf(auth, 0);
    return index >= 0;
}