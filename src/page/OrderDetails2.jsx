import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { FormOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Breadcrumb, Row, Col, Input, Typography, Tag, Space, Table, Descriptions, message } from 'antd';
import { getOrderAPI, marksOrderRemarksRead, acceptPaymentAPI, rejectPaymentAPI } from '../api/api';
import { getOrderStatus, getPaymentStatusTags } from '../utils/status';
import AddMarkModel from '../component/AddMarkModel2';
import { parseAddress } from '../utils/address';
import { checkAuthority } from '../utils/auth';
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;
function OrderDetails(props) {
    const remarksColumns = [
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: createdAt => (
                <span>{createdAt.replace(/T/g, " ").replace(/Z/g, "")}</span>
            ),
        },
        {
            title: '作者',
            dataIndex: 'mode',
            key: 'mode',
            render: (mode) => (
                <Space size="middle">
                    {mode == 1 ? "学果网" : "机构用户"}
                </Space>
            ),
        },
        {
            title: '信息',
            dataIndex: 'info',
            key: 'info',
        },
        {
            title: '备注',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {status == 1 ? <Tag color="red">未读</Tag> : <Tag color="green">已读</Tag>}
                </span>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {record.status == 1 && checkMarkAuth(record) ? <a onClick={() => { handleMarkRead(record.id) }}>标记已读</a> : ""}
                </Space>
            ),
        },
    ];

    const paymentColumns = [
        {
            title: '时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: createdAt => (
                <span>{createdAt.replace(/T/g, " ").replace(/Z/g, "")}</span>
            ),
        },
        {
            title: '费用',
            dataIndex: 'title',
            key: 'title'
        },
        // {
        //     title: '收支',
        //     dataIndex: 'mode',
        //     key: 'mode',
        //     render: mode => (
        //         <span>
        //             {mode == 1 ? <Tag color="green">收入</Tag> : <Tag color="red">支出</Tag>}
        //         </span>
        //     )
        // },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <span style={record.mode == 1 ? { "color": "#52c41a" } : { "color": "#f5222d" }}>
                    {record.mode == 1 ? "+" : "-"}{amount}
                </span>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {getPaymentStatusTags(status)}
                </span>
            )
        },
        {
            title: '审批',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                let disableApprove = record.status != 1;
                return (<div>
                    {disableApprove ? "" : (
                        <div>
                            <a onClick={() => { approveOrder(record.id) }}>通过</a>&nbsp;/&nbsp;
                            <a onClick={() => { rejectOrder(record.id) }}>拒绝</a>
                        </div>
                    )}

                </div>)
            },
        }
    ];
    let { id } = useParams();
    let [markModelVisible, setMarkModelVisible] = useState(false);
    let [mark, setMark] = useState("");
    let history = useHistory();
    let [orderInfo, setOrderInfo] = useState({
        student_summary: {
            name: "",
            gender: false,
        },
        intent_subject: [],
        PaymentInfo: [],
        RemarkInfo: [],
    })
    useEffect(() => {
        fetchData();
    }, []);
    const checkMarkAuth = (record) => {
        if (sessionStorage.getItem("org_id") == 1 && record.mode == 2) {
            return true;
        }
        if (sessionStorage.getItem("org_id") != 1 && record.mode == 1) {
            return true;
        }
        return false;
    }
    const fetchData = async () => {
        let res = await getOrderAPI(id);
        if (res.err_msg == "success") {
            setOrderInfo(res.data);
        } else {
            message.warning("获取机构信息失败：" + res.err_msg);
            history.goBack();
            return;
        }
    }
    const rejectOrder = async (id) => {
        confirm({
            title: '确认拒绝?',
            icon: <CloseOutlined style={{ color: "#cf1322" }} />,
            content: '是否确认拒绝这笔费用？',
            async onOk() {
                let res = await rejectPaymentAPI(id)
                if (res.err_msg == "success") {
                    message.warn("缴费已拒绝");
                    fetchData();
                } else {
                    message.error("审核失败，" + res.err_msg);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    const approveOrder = async (id) => {
        confirm({
            title: '确认通过?',
            icon: <CheckOutlined style={{ color: "#237804" }} />,
            content: '是否确认通过这笔费用？',
            async onOk() {
                let res = await acceptPaymentAPI(id)
                if (res.err_msg == "success") {
                    message.success("缴费已通过");
                    fetchData();
                } else {
                    message.error("审核失败，" + res.err_msg);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }

    const handleMarkRead = async id => {
        let res = await marksOrderRemarksRead(id);
        if (res.err_msg == "success") {
            message.success("标记已读");
        } else {
            message.error("标记失败：" + res.err_msg);
        }
        fetchData();
    }


    const openAddMarkModel = e => {
        setMarkModelVisible(true);
    }
    const closeAddMarkModel = e => {
        setMarkModelVisible(false);
    }

    if (!checkAuthority("审核订单权限")) {
        paymentColumns.pop();
    }

    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                <Breadcrumb.Item>订单详情</Breadcrumb.Item>
            </Breadcrumb>
            <Descriptions title="基本信息" bordered style={{ marginBottom: 20, marginTop: 20 }}>
                <Descriptions.Item label="姓名">{orderInfo.student_summary.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{orderInfo.student_summary.gender ? "男" : "女"}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{orderInfo.student_summary.email}</Descriptions.Item>
                <Descriptions.Item label="手机号：">{orderInfo.student_summary.telephone}</Descriptions.Item>
                <Descriptions.Item label="居住地址" >{parseAddress(orderInfo.student_summary.address)}</Descriptions.Item>
                <Descriptions.Item label="录单员">{orderInfo.author_name}</Descriptions.Item>
                <Descriptions.Item label="派单员">{orderInfo.publisher_name}</Descriptions.Item>
                <Descriptions.Item label="推荐机构" span={3}>{orderInfo.org_name}</Descriptions.Item>
                <Descriptions.Item label="报名意向" span={3}>
                    <div style={{ margin: "0px 0px" }}>
                        {orderInfo.intent_subject != undefined && orderInfo.intent_subject.map((v, id) => (
                            <div key={id}>{v}</div>
                        ))}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="状态" span={3}>{getOrderStatus(orderInfo.status)}</Descriptions.Item>
                <Descriptions.Item label="备注">{orderInfo.student_summary.note}</Descriptions.Item>
            </Descriptions>

            <Row
                justify="space-between"
                style={{ marginTop: "10px" }}>

                <Col>
                    <Title level={5} >回访记录</Title>
                </Col>
                <Col>
                    <a onClick={() => openAddMarkModel()} >
                        <FormOutlined />新增回访记录
                    </a>
                </Col>
            </Row>
            <Table
                pagination={false}
                style={{ marginTop: "10px" }}
                columns={remarksColumns}
                dataSource={orderInfo.RemarkInfo}
            />

            <Title level={5} style={{ marginTop: 20 }}>缴费情况</Title>
            <Table
                pagination={false}
                style={{ marginTop: "10px" }}
                columns={paymentColumns}
                dataSource={orderInfo.PaymentInfo}
            />

            <Row justify="end" style={{ marginTop: 8 }} gutter={[16, 16]} >
                <Col><Button onClick={() => history.goBack()}>返回</Button></Col>
            </Row>

            <AddMarkModel
                id={orderInfo.id}
                orderStatus={orderInfo.status}
                visible={markModelVisible}
                closeModel={closeAddMarkModel}
                refreshData={fetchData} />
        </div>
    );
}
export default OrderDetails;