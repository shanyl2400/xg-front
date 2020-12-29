import React, { useState } from 'react';
import { Modal, Card, Row, Col, Button, message } from 'antd';
import { getPaymentStatus } from '../utils/status';
import { acceptPaymentAPI, rejectPaymentAPI } from '../api/api';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function ReviewOrderModel(props) {
    let onCancel = () => {
        props.closeModel();
    }
    let onReject = async () => {
        let res = await rejectPaymentAPI(props.paymentData.id)
        if (res.err_msg == "success") {
            message.warn("订单已拒绝");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("审核失败，" + res.err_msg);
        }
    }
    let onApprove = async () => {
        let res = await acceptPaymentAPI(props.paymentData.id)
        if (res.err_msg == "success") {
            message.success("订单已通过");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("审核失败，" + res.err_msg);
        }
    }
    return (
        <Modal
            title="审批订单"
            visible={props.visible}
            footer={null}
        >
            <Card style={{ width: "100%", margin: "5px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>姓名：{props.paymentData.student_name}</Col>
                    <Col span={12}>代理人：{props.paymentData.publisher_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>推荐机构：{props.paymentData.org_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名：
                        <ul style={{ margin: "10px 10px" }}>
                            {props.paymentData.intent_subject.map((v, id) =>
                                <li key={id}>{v}</li>
                            )}
                        </ul>

                    </Col>
                </Row>
                <Row gutter={[16, 16]} key={1}>
                    <Col span={12}>状态：{getPaymentStatus(props.paymentData.status)}</Col>
                </Row>

                <div style={{ float: "right", left: 20, fontSize: 30, color: "#393", marginTop: -40, marginRight: 30 }}>
                    <span style={props.paymentData.mode == 1 ? { "color": "#52c41a" } : { "color": "#f5222d" }}>
                        {props.paymentData.mode == 1 ? "+" : "-"}￥{props.paymentData.amount}
                    </span>
                </div>
            </Card>

            <Row style={{ marginTop: 30 }}>
                <Col offset={12} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onReject} type="primary" danger>驳回</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onApprove} type="primary">通过</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default ReviewOrderModel;
