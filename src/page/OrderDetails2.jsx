import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { FormOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Breadcrumb, Row, Col, Input, Typography, Tag, Space, Table, Descriptions, PageHeader, message } from 'antd';
import { getOrderAPI, marksOrderRemarksRead, getCommissionSettlementByPaymentIDAPI, acceptPaymentAPI, rejectPaymentAPI, getOrgAPI } from '../api/api';
import { getOrderStatus, getPaymentStatusTags } from '../utils/status';
import ReviewOrderModel from '../component/ReviewOrderModel';
import AddMarkModel from '../component/AddMarkModel2';
import CommissionModel from '../component/CommissionModel';
import UpdatePriceModel from '../component/UpdatePriceModel';
import CommissionViewModel from '../component/CommissionViewModel';
import { parseAddress } from '../utils/address';
import { checkAuthority } from '../utils/auth';
import { NO } from '../utils/id';
import { formatOnlyDate } from '../utils/date';
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
            title: '回访时间',
            dataIndex: 'revisit_at',
            key: 'revisit_at',
            render: revisitAt => (
                <span>{revisitAt != null && formatOnlyDate(new Date(Date.parse(revisitAt)))}</span>
            ),
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
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            render: id => (
                <span>{NO("PM", id)}</span>
            ),
        },
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
                let disableUpdatePrice = record.status != 1 && record.status != 2;
                let disableCommission = record.status != 2;
                let enableCommission = record.status == 5;
                return (<div>
                    {!disableApprove && (<span><a onClick={() => { reviewPayment(record.id) }}>审核</a>&nbsp;&nbsp;</span>)}
                    {!disableUpdatePrice && (<span><a onClick={() => { updatePrice(record) }}>改价</a>&nbsp;&nbsp;</span>)}
                    {!disableCommission && (<span><a onClick={() => { settlePayment(record) }}>结算</a>&nbsp;&nbsp;</span>)}
                    {enableCommission && (<span><a onClick={() => { settleViewPayment(record) }}>查看结算</a>&nbsp;&nbsp;</span>)}
                </div>)
            },
        }
    ];
    let { id } = useParams();
    let [markModelVisible, setMarkModelVisible] = useState(false);
    let [updatePriceModelInfo, setUpdatePriceModelInfo] = useState({
        visible: false,
        record: {}
    });
    let [mark, setMark] = useState("");
    let [reviewModelInfo, setReviewModelInfo] = useState({
        visible: false,
    })
    let [settleModelInfo, setSettleModelInfo] = useState({
        visible: false
    })
    let [settleViewModelInfo, setSettleViewModelInfo] = useState({
        visible: false
    })
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
    let [orgInfo, setOrgInfo] = useState({});
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

        let res2 = await getOrgAPI(res.data.to_org_id);
        if (res2.err_msg == "success") {
            setOrgInfo(res2.org);
        } else {
            message.warning("获取机构信息失败：" + res2.err_msg);
            history.goBack();
            return;
        }

    }
    const handleReviewOrderModel = (flag) => {
        setReviewModelInfo({
            visible: flag,
        });
    }
    const handleSettleModel = () => {
        setSettleModelInfo({
            visible: false,
        });
    }

    const handleSettleViewModel = () => {
        setSettleViewModelInfo({
            visible: false,
        });
    }
    const updatePrice = async (record) => {
        setUpdatePriceModelInfo({
            visible: true,
            record: record,
        });
    }
    const settlePayment = async (record) => {
        setSettleModelInfo({
            visible: true,
            record: record,
        })
    }
    const settleViewPayment = async (record) => {
        let ret = await getCommissionSettlementByPaymentIDAPI(record.id);
        if (ret.err_msg == "success") {
            setSettleViewModelInfo({
                visible: true,
                record: record,
                settlement: ret.settlements[0]
            })
        } else {
            message.warning("获取结算信息失败" + ret.err_msg);
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

    const reviewPayment = async (id) => {
        for (let i = 0; i < orderInfo.PaymentInfo.length; i++) {
            if (id == orderInfo.PaymentInfo[i].id) {
                let orderData = orderInfo;
                orderData.mode = orderInfo.PaymentInfo[i].mode;
                orderData.amount = orderInfo.PaymentInfo[i].amount;
                orderData.id = id;
                setReviewModelInfo({
                    visible: true,
                    paymentData: orderData
                });
                return;
            }
        }
        message.warn("找不到这笔收支");
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

    const closeUpdatePriceModel = e => {
        setUpdatePriceModelInfo({ visible: false, record: {} });
    }

    if (!checkAuthority("审核订单权限")) {
        paymentColumns.pop();
    }

    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <PageHeader
                ghost={false}
                onBack={() => history.goBack()}
                title="订单详情"
                subTitle="学员名单派单详情"
                extra={[
                    <Button key="1" type="primary" onClick={() => openAddMarkModel()}>
                        回访
                    </Button>,
                ]}
            ></PageHeader>
            <Descriptions title="基本信息" bordered style={{ marginBottom: 20, marginTop: 20 }}>
                <Descriptions.Item label="姓名">{orderInfo.student_summary.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{orderInfo.student_summary.gender ? "男" : "女"}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{orderInfo.student_summary.email}</Descriptions.Item>
                <Descriptions.Item label="手机号：">{orderInfo.student_summary.telephone}</Descriptions.Item>
                <Descriptions.Item label="居住地址" >{parseAddress(orderInfo.student_summary.address)}</Descriptions.Item>
                <Descriptions.Item label="录单员">{orderInfo.author_name}</Descriptions.Item>
                <Descriptions.Item label="派单员">{orderInfo.publisher_name}</Descriptions.Item>
                <Descriptions.Item label="订单号" span={3}>{NO("OR", orderInfo.id)}</Descriptions.Item>
                <Descriptions.Item label="推荐机构" span={1}>{orderInfo.org_name}</Descriptions.Item>
                <Descriptions.Item label="报名意向" span={1}>
                    <div style={{ margin: "0px 0px" }}>
                        {orderInfo.intent_subject != undefined && orderInfo.intent_subject.map((v, id) => (
                            <div key={id}>{v}</div>
                        ))}
                    </div>
                </Descriptions.Item>
                <Descriptions.Item label="状态" span={1}>{getOrderStatus(orderInfo.status)}</Descriptions.Item>
                <Descriptions.Item label="结算比例" span={3}>{orgInfo.settlement_instruction != "" ? orgInfo.settlement_instruction : "默认方案"}</Descriptions.Item>
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

            <AddMarkModel
                id={orderInfo.id}
                orderStatus={orderInfo.status}
                visible={markModelVisible}
                closeModel={closeAddMarkModel}
                refreshData={fetchData} />

            <UpdatePriceModel
                closeModel={closeUpdatePriceModel}
                visible={updatePriceModelInfo.visible}
                refreshData={fetchData}
                record={updatePriceModelInfo.record}
            />
            <ReviewOrderModel
                refreshData={fetchData}
                paymentData={reviewModelInfo.paymentData}
                visible={reviewModelInfo.visible}
                closeModel={() => handleReviewOrderModel(false)} />
            <CommissionModel
                refreshData={fetchData}
                visible={settleModelInfo.visible}
                closeModel={() => handleSettleModel()}
                record={settleModelInfo.record}
            />
            <CommissionViewModel
                visible={settleViewModelInfo.visible}
                closeModel={() => handleSettleViewModel()}
                record={settleViewModelInfo.record}
                settlement={settleViewModelInfo.settlement}
            />
        </div >
    );
}
export default OrderDetails;