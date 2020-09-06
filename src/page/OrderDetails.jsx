import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, Breadcrumb, Row, Col, Typography, message } from 'antd';
import { getOrderAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
const { Title } = Typography;
function OrderDetails(props) {
    let { id } = useParams();
    let history = useHistory();
    let [orderInfo, setOrderInfo] = useState({
        student_summary: {
            name: "",
            gender: false,
        },
        intent_subject: [],
        PaymentInfo: [],
    })
    useEffect(() => {
        const fetchData = async () => {
            let res = await getOrderAPI(id);
            if (res.err_msg == "success") {
                console.log(res.data)
                setOrderInfo(res.data);
            } else {
                message.warning("获取机构信息失败：" + res.err_msg);
                history.goBack();
                return;
            }
        }
        fetchData();
    }, []);
    console.log(orderInfo)
    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>订单管理</Breadcrumb.Item>
                <Breadcrumb.Item>订单详情</Breadcrumb.Item>
            </Breadcrumb>
            <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>姓名：{orderInfo.student_summary.name}</Col>
                    <Col span={12}>性别：{orderInfo.student_summary.gender ? "男" : "女"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>手机号：{orderInfo.student_summary.telephone}</Col>
                    <Col span={12}>居住地址：{orderInfo.student_summary.address}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>推荐机构：{orderInfo.org_name}</Col>
                    {/* <Col span={12}>订单来源：百度</Col> */}
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名：
                        <ul style={{ margin: "10px 10px" }}>
                            {orderInfo.intent_subject.map((v, id) =>
                                <li key={id}>{v}</li>
                            )}
                        </ul>

                    </Col>
                </Row>
                <Row gutter={[16, 16]} key={1}>
                    <Col span={12}>状态：{getOrderStatus(orderInfo.status)}</Col>
                </Row>
            </Card>

            {orderInfo.PaymentInfo.map((v) =>
                <Card key={v.id} style={{ width: "40%", margin: "20px 5px" }}>
                    <p>费用：{v.title}</p>
                    <p>收支：{v.mode == 1 ? "收入" : "支出"}</p>
                    <p>金额：<span style={v.mode == 1 ? { "color": "#52c41a" } : { "color": "#f5222d" }}>
                        {v.mode == 1 ? "+" : "-"}{v.amount}
                    </span></p>
                </Card>
            )}
            <Row gutter={[16, 16]}>
                <Col offset={22} span={1}><Button onClick={() => history.goBack()}>返回</Button></Col>
            </Row>
        </div>
    );
}
export default OrderDetails;