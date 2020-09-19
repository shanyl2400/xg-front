import axios from "axios"; //导入axios

const baseURL = "http://101.133.139.38:8088/api"

axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("token");

export function loginAPI(name, password){
    return axios.post(baseURL+"/user/login",{
        name: name,
        password: password
    }).then(res => {
        console.log(res.data);
        return res.data;
    }).catch(error => {
        console.error(error)
        return null;
    })
}

export async function updatePasswordAPI(password) {
    try {
        let res = await axios.put(baseURL + "/user/password", {
            new_password: password
        })
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listSubjects(){
    try {
        let res = await axios.get(baseURL+"/subjects/0")
        return res.data.subjects;
    } catch (e) {
        return {err_msg: e}
    } 
}
export async function listAuths(){
    try {
        let res = await axios.get(baseURL+"/auths/")
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createRole(data){
    try {
        let res = await axios.post(baseURL+"/role/", data)
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createStudentAPI(values){
    try {
        let res = await axios.post(baseURL + "/student/", values);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listStudentAPI(page, pageSize, status){
    try {
        let res = await axios.get(baseURL + `/students/private?page=${page}&page_size=${pageSize}&status=${status}`);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listAllStudentAPI(page, pageSize, status){
    try {
        let res = await axios.get(baseURL + `/students/?page=${page}&page_size=${pageSize}&status=${status}`);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}
export async function getStudentByIdAPI(id) {
    try {
        let res = await axios.get(baseURL + "/student/" + id);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listOrgsAPI(page, pageSize) {
    try {
        if(page == undefined || pageSize == undefined){
            page = 0;
            pageSize = 0;
        }
        let res = await axios.get(baseURL + `/orgs/?page=${page}&page_size=${pageSize}`);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listSubOrgsAPI(condition) {
    try {
        let address = condition.address;
        let rawSubjects = condition.subjects;
        let subjects = "";
        if(rawSubjects != null && rawSubjects != undefined) {
            subjects = rawSubjects.join(",");
        }
        let res = await axios.get(baseURL + `/orgs/campus?address=${address}&subjects=${subjects}`);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    }
}

export async function listOrderSourcesAPI() {
    try {
        let res = await axios.get(baseURL + "/order_sources/")
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createOrderSourcesAPI(data) {
    try {
        let res = await axios.post(baseURL + "/order_source/", data)
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createOrderAPI(data){
    try {
        let res = await axios.post(baseURL + "/order/", data);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function getStatisticsSummaryAPI() {
    try {
        let res = await axios.get(baseURL + "/statistics/summary");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function getStatisticsGraphAPI() {
    try {
        let res = await axios.get(baseURL + "/statistics/graph");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listPendingOrgsAPI() {
    try {
        let res = await axios.get(baseURL + "/orgs/pending");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}
export async function getOrgAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/" + id);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listSubjectsAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/0");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createSubjectAPI(data) {
    try {
        let res = await axios.post(baseURL + "/subject/", data);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createOrgAPI(data) {
    try {
        let res = await axios.post(baseURL + "/org/", data);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function rejectOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function approveOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/approve");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function revokeOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/revoke");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listOrdersAPI(page, pageSize, data) {
    try {
        let api = `/orders/?page=${page}&page_size=${pageSize}`;
        if(data != null && data.status != undefined && data.status != 0) {
            api = api + `&status=${data.status}`;
        }
        if(data != null && data.orgId != undefined && data.orgId != 0) {
            api = api + `&to_org_ids=${data.orgId}`;
        }
        let res = await axios.get(baseURL + api)

        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listAuthOrdersAPI(page, pageSize, data) {
    try {
        let api = `/orders/author?page=${page}&page_size=${pageSize}`;
        if(data != null && data.status != undefined && data.status != 0) {
            api = api + `&status=${data.status}`;
        }
        if(data != null && data.orgId != undefined && data.orgId != 0) {
            api = api + `&to_org_ids=${data.orgId}`;
        }
        let res = await axios.get(baseURL + api)
        // let res = await axios.get(baseURL + "/orders/author?page=" + page + "&page_size=" + pageSize)
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listOrgOrdersAPI(page, pageSize) {
    try {
        let res = await axios.get(baseURL + "/orders/org?page=" + page + "&page_size=" + pageSize)
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listPendingOrdersAPI() {
    try {
        let res = await axios.get(baseURL + "/orders/pending")
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function getOrgSubjectsAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/"+ id +"/subjects");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}
export async function getOrderAPI(id) {
    try {
        let res = await axios.get(baseURL + "/order/" + id);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function getPendingPaymentAPI() {
    try {
        let res = await axios.get(baseURL + "/payments/pending");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function acceptPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/accept");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function rejectPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}


export async function listRolesAPI() {
    try {
        let res = await axios.get(baseURL + "/roles/");
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function createUserAPI(values){
    try {
        let res = await axios.post(baseURL + "/user/", values);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function listUsersAPI(page, pageSize){
    try {
        let res = await axios.get(baseURL + `/users/?page=${page}&page_size=${pageSize}`);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function resetUserPasswordAPI(id){
    try {
        let res = await axios.put(baseURL + "/user/reset/" + id);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}

export async function signupOrderAPI(id, data) {
    try {
        let res = await axios.put(baseURL + "/order/" + id + "/signup", data);
        return res.data;
    } catch (e) {
        return {err_msg: e}
    } 
}


export async function payOrderAPI(id, data) {
    try {
        if(data.mode == 1) {
            let res = await axios.post(baseURL + "/payment/" + id + "/pay", data);
            return res.data;
        }else{
            let res = await axios.post(baseURL + "/payment/" + id + "/payback", data);
            return res.data;
        }
        
    } catch (e) {
        return {err_msg: e}
    } 
}
