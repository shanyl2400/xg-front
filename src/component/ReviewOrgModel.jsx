import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Button, message } from 'antd';
import { rejectOrgReview, approveOrgReview } from '../api/api';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function ReviewOrgModel(props) {
    let onCancel = () => {
        props.closeModel();
    }
    let onReject = async () => {
        let res = await rejectOrgReview(props.orgData.id);
        if(res.err_msg == "success"){
            message.warn("机构已拒绝");
            props.closeModel();
            props.refreshData();
        }else{
            message.error("审批失败," + res.err_msg);
        }
    }
    let onApprove = async () => {
        let res = await approveOrgReview(props.orgData.id);
        if(res.err_msg == "success"){
            message.success("机构已通过");
            props.closeModel();
            props.refreshData();
        }else{
            message.error("审批失败," + res.err_msg);
        }
    }

    return (
        <Modal
            title="审批机构"
            visible={props.visible}
            footer={null}
        >
            <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>机构名称：{props.orgData.name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>手机号：{props.orgData.telephone}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>地址：{props.orgData.address}</Col>
                </Row>
                {/* <Row gutter={[16, 16]} key={1}>
                        <Col span={12}>状态：已认证</Col>
                </Row> */}
               
            </Card>

            <Row style={{marginTop:30}}>
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

export default ReviewOrgModel;
