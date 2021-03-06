import React, { useState } from 'react';
import { Modal, Card, Row, Col, Button, Descriptions, message } from 'antd';
import { revokeOrgReview } from '../api/api';
import { parseAddress } from "../utils/address";
import OrgCertificationView from './OrgCertificationView';
import { formatDate } from '../utils/date';

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
            onCancel={onCancel}
            width={600}
        >
            <Descriptions bordered >
                <Descriptions.Item label="机构名称" span={3}>{props.orgData.name}</Descriptions.Item>
                <Descriptions.Item label="手机号" span={3}>{props.orgData.telephone}</Descriptions.Item>
                <Descriptions.Item label="地址" span={3}>{parseAddress(props.orgData.address)}</Descriptions.Item>
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
