import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, PageHeader, message, Row, Col, Typography, Descriptions, Table, Space } from 'antd';
import { getStudentByIdAPI } from '../api/api';
import { parseAddress } from '../utils/address';
import { formatDate } from "../utils/date";
const { Title } = Typography;
function StudentDetails(props) {
    const columns = [
        {
            title: '派单时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: createdAt => (
                <span>{formatDate(new Date(Date.parse(createdAt)))}</span>
            ),
        },
        {
            title: '机构',
            dataIndex: 'org_name',
            key: 'org_name'
        },
        {
            title: '学科',
            dataIndex: 'intent_subject',
            key: 'intent_subject',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {getStatusName(status)}
                </span>
            )
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <span>
                    <a onClick={() => details(id)}>详情</a>
                </span>
            )
        }
    ];
    const [student, setStudent] = useState({});
    let { id } = useParams();
    let history = useHistory();
    useEffect(() => {
        const fetchData = async () => {
            const res = await getStudentByIdAPI(id);
            if (res.err_msg == "success") {
                setStudent(res.student);
            } else {
                message.warn("查不到学生信息");
                history.goBack();
            }
        }
        fetchData();
    }, []);

    const details = (id) => {
        history.push("/main/order_details/" + id);
    }

    let getStatusName = (id) => {
        switch (id) {
            case 1:
                return "已创建";
            case 2:
                return "已报名，待审核";
            case 3:
                return "收支变更，待确认";
            case 4:
                return "已确认";
        }
    }
    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <PageHeader
                ghost={false}
                onBack={() => history.goBack()}
                title="学员名单"
                subTitle="学员名单详情"></PageHeader>
            <Descriptions title="基本信息" bordered style={{ marginBottom: 20, marginTop: 20 }}>
                <Descriptions.Item label="姓名">{student.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{student.gender ? "男" : "女"}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{student.email}</Descriptions.Item>
                <Descriptions.Item label="手机号：">{student.telephone}</Descriptions.Item>
                <Descriptions.Item label="录单员">{student.authorName}</Descriptions.Item>
                <Descriptions.Item label="居住地址" >{parseAddress(student.address)}{student.address_ext}</Descriptions.Item>
                <Descriptions.Item label="报名意向">
                    <div style={{ margin: "0px 0px" }}>
                        {student.intent_subject != undefined && student.intent_subject.map(item => (
                            <div key={item}>{item}</div>
                        ))}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="订单来源" span={3}>{student.order_source_name}{student.order_source_ext != "" && " (" + student.order_source_ext + ")"}</Descriptions.Item>
                <Descriptions.Item label="备注">{student.note}</Descriptions.Item>
            </Descriptions>

            <Title level={5}>已推荐机构</Title>
            <Table
                pagination={false}
                style={{ marginTop: "30px" }}
                columns={columns}
                dataSource={student.orders}
            />

        </div>
    );
}
export default StudentDetails;