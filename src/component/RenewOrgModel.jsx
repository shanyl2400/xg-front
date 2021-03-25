import React, { useState } from 'react';
import { Modal, InputNumber, Row, Col, Button, Descriptions, message } from 'antd';
import { renewOrgReview } from '../api/api';
import { parseAddress } from "../utils/address";
import OrgCertificationView from './OrgCertificationView';
import { formatDate } from '../utils/date';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function RenewOrgModel(props) {
    const [extendExpire, setExtendExpire] = useState(12);
    let onCancel = () => {
        props.closeModel();
    }
    let onRevoke = async () => {
        let res = await renewOrgReview(props.orgData.id, { valid_month: extendExpire });
        if (res.err_msg == "success") {
            message.success("延期成功");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("延期失败," + res.err_msg);
        }
    }
    const changeExpireExtend = e => {
        setExtendExpire(e);
    }
    return (
        <Modal
            title="延期机构"
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
                <Descriptions.Item label="资质" span={6}>
                    <OrgCertificationView
                        businessLicense={props.orgData.business_license}
                        entityIdentity={props.orgData.corporate_identity}
                        schoolPermission={props.orgData.school_permission}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="延期时间" span={6}>
                    <InputNumber
                        min={1}
                        max={100}
                        value={extendExpire}
                        onChange={changeExpireExtend}
                        formatter={value => `${value}个月`}
                        parser={value => value.replace('个月', '')}
                    />
                </Descriptions.Item>
            </Descriptions>

            <Row style={{ marginTop: 30 }}>
                <Col offset={16} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onRevoke} type="primary">延期</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default RenewOrgModel;
