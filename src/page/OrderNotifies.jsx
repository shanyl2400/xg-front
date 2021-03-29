import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table, Pagination } from 'antd';
import { useHistory } from "react-router-dom";
import { listOrderNotifies, listAuthorOrderNotifies, marksOrderNotifyRead } from '../api/api';
import { checkAuthority } from '../utils/auth';
import { showTotal } from '../utils/page';

const pageSize = 10;
let currentPage = 1;
function OrderRemarksList(props) {
    const columns = [
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: createdAt => (
                <span>{createdAt.replace(/T/g, " ").replace(/Z/g, "")}</span>
            ),
        },
        {
            title: '学员姓名',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span>
                    {record.order_info.student_name}
                </span>
            ),
        },
        {
            title: '学员电话',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span>
                    {record.order_info.student_telephone}
                </span>
            ),
        },
        {
            title: '派送机构',
            dataIndex: 'id',
            key: 'id',
            render: (id, record) => (
                <span>
                    {record.order_info.org_name}
                </span>
            ),
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => { viewDetails(record) }}>详情</a>
                    <a onClick={() => { handleMarkRead(record.id) }}>标记已读</a>
                </Space>
            ),
        },
    ];

    let [remarksTotal, setRemarksTotal] = useState(0);
    let [records, setRecords] = useState([]);
    let history = useHistory();

    useEffect(() => {
        fetchData(currentPage);
    }, []);

    const fetchData = async (page, data) => {
        data = { status: 1 }
        if (checkAuthority("查看所有订单")) {
            let res = await listOrderNotifies(page, pageSize, { status: 1 });
            if (res.data != null) {
                setRemarksTotal(res.total);
                setRecords(res.data)
            }
        } else if (checkAuthority("录单权")) {
            let res = await listAuthorOrderNotifies(page, pageSize, { status: 1 })
            if (res.data != null) {
                setRemarksTotal(res.total);
                setRecords(res.data)
            }
        }

    }
    const viewDetails = record => {
        marksOrderNotifyRead(record.id);
        history.push("/main/order_details/" + record.order_id)
    }

    const handleChangePage = page => {
        currentPage = page;
        fetchData(currentPage);
    }
    const handleMarkRead = async id => {
        let res = await marksOrderNotifyRead(id);
        if (res.err_msg == "success") {
            message.success("标记已读");
        } else {
            message.error("标记失败：" + res.err_msg);
        }
        fetchData(currentPage);
    }

    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>消息中心</Breadcrumb.Item>
                <Breadcrumb.Item>系统消息</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                pagination={false}
                style={{ marginTop: "30px" }}
                columns={columns}
                dataSource={records}
            />
            <Pagination
                showSizeChanger={false}
                onChange={handleChangePage}
                style={{ textAlign: "right", marginTop: 10 }}
                defaultPageSize={pageSize}
                size="small"
                showTotal={showTotal}
                total={remarksTotal} />
        </div>
    );
}

export default OrderRemarksList;
