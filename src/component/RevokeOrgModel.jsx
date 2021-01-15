import React, { useState } from 'react';
import { Modal, Card, Row, Col, Button, Descriptions, message } from 'antd';
import { revokeOrgReview } from '../api/api';
import { parseAddress } from "../utils/address";

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function RevokeOrgModel(props) {
    let onCancel = () => {
        props.closeModel();
    }
    let onRevoke = async () => {
        let res = await revokeOrgReview(props.orgData.id);
        if (res.err_msg == "success") {
            message.warn("机构已吊销");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("审批失败," + res.err_msg);
        }
    }
    return (
        <Modal
            title="吊销机构"
            visible={props.visible}
            footer={null}
        >
            <Descriptions bordered >
                <Descriptions.Item label="机构名称" span={3}>{props.orgData.name}</Descriptions.Item>
                <Descriptions.Item label="手机号" span={3}>{props.orgData.telephone}</Descriptions.Item>
                <Descriptions.Item label="地址" span={3}>{parseAddress(props.orgData.address)}</Descriptions.Item>
            </Descriptions>
            {/* <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>机构名称：{props.orgData.name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>手机号：{props.orgData.telephone}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>地址：{parseAddress(props.orgData.address)}</Col>
                </Row>

            </Card> */}

            <Row style={{ marginTop: 30 }}>
                <Col offset={16} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onRevoke} type="primary" danger>吊销</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default RevokeOrgModel;
