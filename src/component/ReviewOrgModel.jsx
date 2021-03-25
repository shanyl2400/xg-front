import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Row, Col, Button, message } from 'antd';
import { rejectOrgReview, approveOrgReview } from '../api/api';
import { parseAddress } from '../utils/address';
import OrgCertificationView from './OrgCertificationView';
import { formatDate } from '../utils/date';

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
        if (res.err_msg == "success") {
            message.warn("机构已拒绝");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("审批失败," + res.err_msg);
        }
    }
    let onApprove = async () => {
        let res = await approveOrgReview(props.orgData.id);
        if (res.err_msg == "success") {
            message.success("机构已通过");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("审批失败," + res.err_msg);
        }
    }

    return (
        <Modal
            title="审批机构"
            visible={props.visible}
            footer={null}
            onCancel={onCancel}
            width={600}
        >
            <Descriptions title="基本信息"
                bordered style={{ marginBottom: 20 }}>
                <Descriptions.Item label="名称" span={4}>{props.orgData.name}</Descriptions.Item>
                <Descriptions.Item label="电话" span={4}>{props.orgData.telephone}</Descriptions.Item>
                <Descriptions.Item label="地址" span={4}> {props.orgData.address}{props.orgData.address_ext}</Descriptions.Item>
                <Descriptions.Item label="过期时间" span={3}>{props.orgData.expired_at == null ? "无限期" : formatDate(new Date(Date.parse(props.orgData.expired_at)))}</Descriptions.Item>
                <Descriptions.Item label="结算说明" span={3}> {props.orgData.settlement_instruction == "" ? "默认方案" : props.orgData.settlement_instruction}</Descriptions.Item>
                <Descriptions.Item label="资质" span={2}>
                    <OrgCertificationView
                        businessLicense={props.orgData.business_license}
                        entityIdentity={props.orgData.corporate_identity}
                        schoolPermission={props.orgData.school_permission}
                    />
                </Descriptions.Item>
            </Descriptions>
            <Row style={{ marginTop: 30 }}>
                <Col offset={15} span={3}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={3}>
                    <Button onClick={onReject} type="primary" danger>驳回</Button>
                </Col>
                <Col span={3}>
                    <Button onClick={onApprove} type="primary">通过</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default ReviewOrgModel;
