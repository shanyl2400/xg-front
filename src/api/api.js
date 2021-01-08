import axios from "axios"; //导入axios

// const baseURL = "http://localhost:8088/api"
const baseURL = "http://101.133.139.38:8088/api"

axios.defaults.headers.common["Authorization"] = sessionStorage.getItem("token");

export function loginAPI(name, password) {
    return axios.post(baseURL + "/user/login", {
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
        return { err_msg: e }
    }
}

export async function listSubjectsAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/details/0")
        return res.data.subjects;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listSubjectsTreeAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/tree")
        return res.data.subjects;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listSubjectsTreeAPIWithData() {
    try {
        let res = await axios.get(baseURL + "/subjects/tree")
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}


export async function listSubjectsAllAPI() {
    try {
        let res = await axios.get(baseURL + "/subjects/all")
        return res.data.subjects;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listAuths() {
    try {
        let res = await axios.get(baseURL + "/auths/")
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createRole(data) {
    try {
        let res = await axios.post(baseURL + "/role/", data)
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createStudentAPI(values) {
    try {
        let res = await axios.post(baseURL + "/student/", values);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listStudentAPI(page, pageSize, data) {
    try {
        let res = await axios.get(baseURL + `/students/private?page=${page}&page_size=${pageSize}&status=${data.status}&no_dispatch_order=${data.noDispatch}&keywords=${data.keywords ? data.keywords : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listAllStudentAPI(page, pageSize, data) {
    try {
        if (data.status == "0") {
            data.status = "";
        }
        let res = await axios.get(baseURL + `/students/?page=${page}&page_size=${pageSize}&status=${data.status}&no_dispatch_order=${data.noDispatch}&keywords=${data.keywords ? data.keywords : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}
export async function getStudentByIdAPI(id) {
    try {
        let res = await axios.get(baseURL + "/student/" + id);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function listOrderSourcesAPI() {
    try {
        let res = await axios.get(baseURL + "/order_sources/")
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createOrderSourcesAPI(data) {
    try {
        let res = await axios.post(baseURL + "/order_source/", data)
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createOrderAPI(data) {
    try {
        let res = await axios.post(baseURL + "/order/", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function getStatisticsSummaryAPI() {
    try {
        // org_id, author, publisher_id, order_source
        let api = `/statistics/summary`;
        let res = await axios.get(baseURL + api);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}
export async function getStatisticsTableAPI(data) {
    try {
        let res = await axios.get(baseURL + `/statistics/table?org_id=${data.org_id}&author=${data.author}&publisher_id=${data.publisher_id}&order_source=${data.order_source}`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function getStatisticsGraphAPI() {
    try {
        let res = await axios.get(baseURL + "/statistics/graph");
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}
export async function getOrgAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/" + id);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}



export async function createSubjectAPI(data) {
    try {
        let res = await axios.post(baseURL + "/subject/", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function listOrderNotifies(page, pageSize, data) {
    try {
        let res = await axios.get(baseURL + `/notifies/orders?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}&status=${data ? data.status : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function marksOrderNotifyRead(id) {
    try {

        let res = await axios.put(baseURL + `/notify/orders/` + id);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listAuthorOrderNotifies(page, pageSize, data) {
    try {
        let res = await axios.get(baseURL + `/notifies/orders/author?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}&status=${data ? data.status : ""}&order_by=created_at desc`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function batchCreateSubjectAPI(data) {
    try {
        let res = await axios.post(baseURL + "/subjects/", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function addOrderMarkAPI(id, content) {
    try {
        let res = await axios.post(baseURL + `/order/${id}/mark`, {
            content: content
        });
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createOrgAPI(data) {
    try {
        let res = await axios.post(baseURL + "/org/", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function updateOrgAPI(id, data) {
    try {
        console.log("Update:", data);
        let res = await axios.put(baseURL + `/org/${id}`, data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}


export async function updateOrgSelfAPI(data) {
    try {
        console.log("Update:", data);
        let res = await axios.put(baseURL + `/org/`, data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function rejectOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function approveOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/review/approve");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function revokeOrgReview(id) {
    try {
        let res = await axios.put(baseURL + "/org/" + id + "/revoke");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listOrdersAPI(page, pageSize, data) {
    console.log(data);
    try {
        let api = `/orders/?page=${page}&page_size=${pageSize}`;
        if (data != null) {
            if (data.status != undefined && data.status != 0) {
                api = api + `&status=${data.status}`;
            }
            if (data.orgId != undefined && data.orgId != 0) {
                api = api + `&to_org_ids=${data.orgId}`;
            }
            if (data.orderSource != undefined && data.orderSource != 0) {
                api = api + `&order_sources=${data.orderSource}`;
            }
            if (data.subject != undefined && data.subject != "") {
                api = api + `&keywords=${data.subject}`;
            }
            if (data.createdStartAt != undefined && data.createdEndAt != undefined &&
                data.createdStartAt != "" && data.createdEndAt != "") {
                api = api + `&create_start_at=${data.createdStartAt}&create_end_at=${data.createdEndAt}`;
            }
        }
        api = api + `&order_by=updated_at desc`;

        let res = await axios.get(baseURL + api);

        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listAuthOrdersAPI(page, pageSize, data) {
    try {
        let api = `/orders/author?page=${page}&page_size=${pageSize}`;
        if (data != null) {
            if (data.status != undefined && data.status != 0) {
                api = api + `&status=${data.status}`;
            }
            if (data.orgId != undefined && data.orgId != 0) {
                api = api + `&to_org_ids=${data.orgId}`;
            }
            if (data.orderSource != undefined && data.orderSource != 0) {
                api = api + `&order_sources=${data.orderSource}`;
            }
            if (data.subject != undefined && data.subject != "") {
                api = api + `&keywords=${data.subject}`;
            }
            if (data.createdStartAt != undefined && data.createdEndAt != undefined &&
                data.createdStartAt != "" && data.createdEndAt != "") {
                api = api + `&create_start_at=${data.createdStartAt}&create_end_at=${data.createdEndAt}`;
            }
        }
        api = api + `&order_by=updated_at desc`;

        let res = await axios.get(baseURL + api)
        // let res = await axios.get(baseURL + "/orders/author?page=" + page + "&page_size=" + pageSize)
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function listOrgOrdersAPI(page, pageSize) {
    try {
        let api = "/orders/org?page=" + page + "&page_size=" + pageSize;
        api = api + `&order_by=updated_at desc`;
        let res = await axios.get(baseURL + api);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}


export async function listPendingOrdersAPI() {
    try {
        let res = await axios.get(baseURL + "/orders/pending")
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function getOrgSubjectsAPI(id) {
    try {
        let res = await axios.get(baseURL + "/org/" + id + "/subjects");
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function getPendingPaymentAPI(page, pageSize) {
    try {

        let res = await axios.get(baseURL + `/payments/pending?page=${page ? page : ""}&page_size=${pageSize ? pageSize : ""}`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function acceptPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/accept");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function rejectPaymentAPI(id) {
    try {
        let res = await axios.put(baseURL + "/payment/" + id + "/review/reject");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}


export async function listRolesAPI() {
    try {
        let res = await axios.get(baseURL + "/roles/");
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function createUserAPI(values) {
    try {
        let res = await axios.post(baseURL + "/user/", values);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}


export async function listUsersWithOrgIdAPI(orgId, page, pageSize) {
    try {
        let res = await axios.get(baseURL + `/users/?page=${page}&page_size=${pageSize}&org_id=${orgId}`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function resetUserPasswordAPI(id) {
    try {
        let res = await axios.put(baseURL + "/user/reset/" + id);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function signupOrderAPI(id, data) {
    try {
        let res = await axios.put(baseURL + "/order/" + id + "/signup", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}
export async function depositOrderAPI(id, data) {
    try {
        let res = await axios.put(baseURL + "/order/" + id + "/deposit", data);
        return res.data;
    } catch (e) {
        return { err_msg: e }
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
        return { err_msg: e }
    }
}

export async function invalidOrderAPI(id) {
    try {
        let res = await axios.put(baseURL + `/order/${id}/invalid`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}

export async function revokeOrderAPI(id) {
    try {
        let res = await axios.put(baseURL + `/order/${id}/revoke`);
        return res.data;
    } catch (e) {
        return { err_msg: e }
    }
}
