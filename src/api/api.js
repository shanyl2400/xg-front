import axios from "axios"; //导入axios

export const website = "http://localhost:8088"
// export const website = "http://101.133.139.38:8088"
export const baseURL = website + "/api"

axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("token");

export function loginAPI(name, password) {
    return axios.post(baseURL + "/user/login", {
        name: name,
        password: password
    }).then(res => {
        console.log(res.data);
        return res.data;
    }).catch(error => {
        console.log(error)
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
        return e.response.data
    }
}

export async function listSubjectsAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/details/0")
        return res.data.subjects;
    } catch (e) {
        return e.response.data
    }
}

export async function listSubjectsTreeAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/tree")
        return res.data.subjects;
    } catch (e) {
        return e.response.data
    }
}

export async function listSubjectsTreeAPIWithData() {
    try {
        let res = await axios.get(baseURL + "/subjects/tree")
        return res.data;
    } catch (e) {
        return e.response.data
    }
}


export async function listSubjectsAllAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/all")
        return res.data.subjects;
    } catch (e) {
        return e.response.data
    }
}

export async function listAuths() {
    try {
        let res = await axios.get(baseURL + "/auths/")
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createRole(data) {
    try {
        let res = await axios.post(baseURL + "/role/", data)
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createStudentAPI(values) {
    try {
        let res = await axios.post(baseURL + "/student/", values);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listStudentAPI(page, pageSize, data) {
    try {
        let params = buildSearchStudentParams(page, pageSize, data)
        let res = await axios.get(baseURL + `/students/private?` + params);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listAllStudentAPI(page, pageSize, data) {
    try {
        let params = buildSearchStudentParams(page, pageSize, data)

        let res = await axios.get(baseURL + `/students/?` + params);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getStudentByIdAPI(id) {
    try {
        let res = await axios.get(baseURL + "/student/" + id);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrgsAPI(page, pageSize, data) {
    try {
        if (page == undefined || pageSize == undefined) {
            page = 0;
            pageSize = 0;
        }
        let api = baseURL + `/orgs/?page=${page}&page_size=${pageSize}`
        if (data != undefined && data.query != undefined && data.query != "") {
            api = api + `&name=${data.query}`;
        }
        let res = await axios.get(api);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listSubOrgsAPI(condition, page, pageSize) {
    try {
        let address = condition.address;
        let rawSubjects = condition.subjects;
        let studentId = condition.student_id;
        let subjects = "";
        if (rawSubjects != null && rawSubjects != undefined) {
            subjects = rawSubjects.join(",");
        }
        let parentId = condition.parent_id;
        let res = await axios.get(baseURL + `/orgs/campus?address=${address}&subjects=${subjects}&student_id=${studentId}&page=${page}&page_size=${pageSize}&parent_id=${parentId}&name=${condition.name ? condition.name : ""}`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrderSourcesAPI() {
    try {
        let res = await axios.get(baseURL + "/order_sources/")
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createOrderSourcesAPI(data) {
    try {
        let res = await axios.post(baseURL + "/order_source/", data)
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function deleteOrderSourcesAPI(id) {
    try {
        let res = await axios.delete(baseURL + "/order_source/" + id)
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createOrderAPI(data) {
    try {
        let res = await axios.post(baseURL + "/order/", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getStatisticsSummaryAPI() {
    try {
        // org_id, author, publisher_id, order_source
        let api = `/statistics/summary`;
        let res = await axios.get(baseURL + api);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}
export async function getStatisticsTableAPI(data) {
    try {
        let res = await axios.get(baseURL + `/statistics/table?org_id=${data.org_id}&author=${data.author}&publisher_id=${data.publisher_id}&order_source=${data.order_source}`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getStatisticsTableGroupAPI(data) {
    try {
        let api = baseURL + `/statistics/group?org_id=${data.org_id}&author=${data.author}&publisher_id=${data.publisher_id}&order_source=${data.order_source}`;
        if (data.time_stamp != null) {
            console.log(data);
            let start_at = data.time_stamp[0];
            let end_at = data.time_stamp[1];
            api = api + `&start_at=${start_at ? start_at : ""}&end_at=${end_at ? end_at : ""}`
        }
        let res = await axios.get(api);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getStatisticsGraphAPI() {
    try {
        let res = await axios.get(baseURL + "/statistics/graph");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listPendingOrgsAPI(page, pageSize, data) {
    try {
        if (page == undefined || pageSize == undefined) {
            page = 0;
            pageSize = 0;
        }
        let api = baseURL + `/orgs/pending?page=${page}&page_size=${pageSize}&order_by=created_at desc`
        if (data != undefined && data.query != undefined && data.query != "") {
            api = api + `&name=${data.query}`;
        }
        let res = await axios.get(api);
        // let res = await axios.get(baseURL + "/orgs/pending");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}
export async function getOrgAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/" + id);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}



export async function createSubjectAPI(data) {
    try {
        let res = await axios.post(baseURL + "/subject/", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrderRemarks(page, pageSize, params) {
    try {
        let status = "";
        if (params != null) {
            status = params.status;
        }
        let res = await axios.get(baseURL + `/orders/remarks?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}&status=${status ? status : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrderNotifies(page, pageSize, data) {
    try {
        let res = await axios.get(baseURL + `/notifies/orders?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}&status=${data ? data.status : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function marksOrderNotifyRead(id) {
    try {

        let res = await axios.put(baseURL + `/notify/orders/` + id);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listAuthorOrderNotifies(page, pageSize, data) {
    try {
        let res = await axios.get(baseURL + `/notifies/orders/author?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}&status=${data ? data.status : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function marksOrderRemarksRead(id) {
    try {
        let data = {
            status: 2,
            ids: [id]
        }
        let res = await axios.put(baseURL + `/orders/marks`, data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function marksOrderRemarksUnread(id) {
    try {
        let data = {
            status: 1,
            ids: [id]
        }
        let res = await axios.put(baseURL + `/orders/marks`, data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function batchCreateSubjectAPI(data) {
    try {
        let res = await axios.post(baseURL + "/subjects/", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function addOrderMarkAPI(id, content) {
    try {
        let res = await axios.post(baseURL + `/order/${id}/mark`, {
            content: content
        });
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createOrgAPI(data) {
    try {
        let res = await axios.post(baseURL + "/org/", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function updateOrgAPI(id, data) {
    try {
        console.log("Update:", data);
        let res = await axios.put(baseURL + `/org/${id}`, data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}


export async function updateOrgSelfAPI(data) {
    try {
        console.log("Update:", data);
        let res = await axios.put(baseURL + `/org/`, data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function rejectOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function approveOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/approve");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function revokeOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/revoke");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrdersAPI(page, pageSize, data) {
    console.log(data);
    try {
        let params = buildSearchOrderParams(page, pageSize, data);
        let api = `/orders/?` + params;
        let res = await axios.get(baseURL + api);

        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function exportOrdersAPI(data) {
    try {
        console.log(data)
        let params = buildSearchOrderParams(1, null, data);
        let api = `/orders/export?` + params;

        // let res = await axios.get(baseURL + api);
        let res = await Download("get", baseURL + api, null, "派单记录.xlsx")
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listAuthOrdersAPI(page, pageSize, data) {
    try {
        let params = buildSearchOrderParams(page, pageSize, data);
        let api = `/orders/author?` + params;

        let res = await axios.get(baseURL + api)
        // let res = await axios.get(baseURL + "/orders/author?page=" + page + "&page_size=" + pageSize)
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listOrgOrdersAPI(page, pageSize) {
    try {
        let api = "/orders/org?page=" + page + "&page_size=" + pageSize;
        api = api + `&order_by=updated_at desc`;
        let res = await axios.get(baseURL + api);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}


export async function listPendingOrdersAPI() {
    try {
        let res = await axios.get(baseURL + "/orders/pending")
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getOrgSubjectsAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/" + id + "/subjects");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}
export async function getOrderAPI(id) {
    if (id < 1) {
        return { err_msg: "invalid id" };
    }
    try {
        let res = await axios.get(baseURL + "/order/" + id);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function getPendingPaymentAPI(page, pageSize) {
    try {

        let res = await axios.get(baseURL + `/payments/pending?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function acceptPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/accept");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function rejectPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}


export async function listRolesAPI() {
    try {
        let res = await axios.get(baseURL + "/roles/");
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function createUserAPI(values) {
    try {
        let res = await axios.post(baseURL + "/user/", values);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function listUsersAPI(page, pageSize, data) {
    try {
        let api = baseURL + `/users/?page=${page}&page_size=${pageSize}`;
        console.log(data)
        if (data != null) {
            api = api + `&role_id=${data.roleID ? data.roleID : ""}&org_id=${data.orgID ? data.orgID : ""}&name=${data.name ? data.name : ""}`;
        }
        let res = await axios.get(api);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}


export async function listUsersWithOrgIdAPI(orgId, page, pageSize) {
    try {
        let res = await axios.get(baseURL + `/users/?page=${page}&page_size=${pageSize}&org_id=${orgId}`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function resetUserPasswordAPI(id) {
    try {
        let res = await axios.put(baseURL + "/user/reset/" + id);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function signupOrderAPI(id, data) {
    try {
        let res = await axios.put(baseURL + "/order/" + id + "/signup", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}
export async function depositOrderAPI(id, data) {
    try {
        let res = await axios.put(baseURL + "/order/" + id + "/deposit", data);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function payOrderAPI(id, data) {
    try {
        if (data.mode == 1) {
            let res = await axios.post(baseURL + "/payment/" + id + "/pay", data);
            return res.data;
        } else {
            let res = await axios.post(baseURL + "/payment/" + id + "/payback", data);
            return res.data;
        }

    } catch (e) {
        return e.response.data
    }
}

export async function invalidOrderAPI(id) {
    try {
        let res = await axios.put(baseURL + `/order/${id}/invalid`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

export async function revokeOrderAPI(id) {
    try {
        let res = await axios.put(baseURL + `/order/${id}/revoke`);
        return res.data;
    } catch (e) {
        return e.response.data
    }
}

function Download(method = "get", url, params, fileName) {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url,
            params: params,
            responseType: 'blob'
        })
            .then(res => {
                let reader = new FileReader();
                let data = res.data;
                reader.onload = e => {
                    if (e.target.result.indexOf('Result') != -1 && JSON.parse(e.target.result).Result == false) {
                        // 进行错误处理
                    } else {
                        if (!fileName) {
                            let contentDisposition = res.headers['content-disposition'];
                            if (contentDisposition) {
                                fileName = window.decodeURI(res.headers['content-disposition'].split('=')[2].split("''")[1], "UTF-8");
                            }
                        }
                        executeDownload(data, fileName);
                    }
                };
                reader.readAsText(data);
                resolve(res.data);
            })
    });
}
//  模拟点击a 标签进行下载
function executeDownload(data, fileName) {
    if (!data) {
        return
    }
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function buildSearchOrderParams(page, pageSize, data) {
    let params = `page=${page}&page_size=${pageSize}`;
    if (data != null) {
        if (data.status == "0") {
            data.status = "";
        }
        if (data.orderSource == "0") {
            data.orderSource = "";
        }
        if (data.author == "0") {
            data.author = "";
        }
        if (data.orgId == "0") {
            data.orgId = "";
        }

        params = params + `&status=${data.status}&to_org_ids=${data.orgId}&keywords=${data.query ? data.query : ""}`
        params = params + `&author_id=${data.author}&order_sources=${data.orderSource}&intent_subjects=${data.subject ? data.subject : ""}&address=${data.address ? data.address : ""}`
        if (data.startAt != null && data.endAt != null) {
            params = params + `&created_start_at=${data.startAt}&created_end_at=${data.endAt}`
        }

        //order by
        let orderBy = "created_at"
        switch (data.orderBy) {
            case 1:
                orderBy = "created_at desc";
                break;
            case 2:
                orderBy = "updated_at desc";
                break;
            default:
                orderBy = "created_at desc";
                break;
        }
        params = params + `&order_by=${orderBy}`
    }
    return params
}

function buildSearchStudentParams(page, pageSize, data) {
    let params = `page=${page}&page_size=${pageSize}`;
    if (data != null) {
        if (data.status == "0") {
            data.status = "";
        }
        if (data.orderSource == "0") {
            data.orderSource = "";
        }
        if (data.author_id == "0") {
            data.author_id = "";
        }
        params = params + `&status=${data.status}&no_dispatch_order=${data.noDispatch}&keywords=${data.keywords ? data.keywords : ""}`
        params = params + `&author_id=${data.author}&order_source_ids=${data.orderSource}&intent_subjects=${data.subject ? data.subject : ""}&address=${data.address ? data.address : ""}`
        if (data.timeRange != null && data.timeRange.length == 2) {
            params = params + `&created_start_at=${data.timeRange[0]}&created_end_at=${data.timeRange[1]}`
        }

        //order by
        params = params + `&order_by=created_at desc`
    }
    return params
}