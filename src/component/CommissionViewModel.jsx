import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Row, Col, Descriptions, InputNumber, Input, message } from 'antd';
import { createCommissionSettlement } from '../api/api';
import { formatDate } from '../utils/date';

const { Option } = Select;
function CommissionViewModel(props) {
    const onClose = e => {
        props.closeModel();
    }
    return (
        <Modal
            title="结算"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ height: "100%", width: "100%" }}>
                <Descriptions bordered>
                    <Descriptions.Item label="费用" span={3}>
                        {props.record && props.record.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="操作人" span={3}>
                        {props.settlement && props.settlement.author_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="金额" span={3}>
                        {props.record && props.record.mode == 1 ? "" : "-"}￥{props.record && props.record.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label="佣金" span={3}>
                        {props.settlement && props.settlement.commission}
                    </Descriptions.Item>
                    <Descriptions.Item label="结算比例" span={3}>
                        {props.settlement && props.settlement.settlement_note}
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>
                        {props.settlement && props.settlement.note}
                    </Descriptions.Item>
                    <Descriptions.Item label="结算时间" span={3}>
                        {props.settlement && formatDate(new Date(Date.parse(props.settlement.created_at)))}
                    </Descriptions.Item>
                </Descriptions>

                <Row justify="end" style={{ marginTop: 10 }}>
                    <Col >
                        <Button htmlType="button" onClick={onClose}>
                            返回
                        </Button>
                    </Col>
                </Row>
            </div>
        </Modal >
    );
}

export default CommissionViewModel;
