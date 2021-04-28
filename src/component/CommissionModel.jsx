import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Row, Col, Descriptions, InputNumber, Input, message } from 'antd';
import { createCommissionSettlement } from '../api/api';

const { Option } = Select;
function CommissionModel(props) {
    let [commission, setCommission] = useState(0);
    let [settlementNode, setSettlementNote] = useState("");
    let [note, setNote] = useState("");

    const onClose = e => {
        reset();
        props.closeModel();
    }
    const reset = () => {
        setCommission(0);
        setSettlementNote("");
        setNote("");
    }
    let changeSettlementNote = e => {
        setSettlementNote(e.target.value);
    }
    let changeNote = e => {
        setNote(e.target.value)
    }
    let changeCommissionAmount = e => {
        let x = Number(e.target.value);
        if (!isNaN(x)) {
            setCommission(x);
        }
    }
    const onSubmit = async e => {
        if (commission == "") {
            message.warn("请填写佣金");
            return;
        }
        if (settlementNode == "") {
            message.warn("请填写结算比例");
            return;
        }
        if (!props.record) {
            message.error("收支记录异常");
            return;
        }
        let res = await createCommissionSettlement({
            payment_id: props.record.id,
            commission: commission,
            settlement_note: settlementNode,
            note: note
        })
        if (res.err_msg == "success") {
            message.success("结算成功");
            onClose();
            props.refreshData();
        } else {
            message.error("结算失败:" + res.err_msg);
            onClose();
        }
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
                    <Descriptions.Item label="金额" span={3}>
                        {props.record && props.record.mode == 1 ? "" : "-"}￥{props.record && props.record.amount}
                    </Descriptions.Item>
                    <Descriptions.Item label="佣金" span={3}>
                        <Input
                            prefix="￥"
                            value={commission}
                            placeholder="请填写"
                            onChange={changeCommissionAmount} />
                    </Descriptions.Item>
                    <Descriptions.Item label="结算比例" span={3}>
                        <Input
                            value={settlementNode}
                            onChange={changeSettlementNote}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>
                        <Input.TextArea
                            value={note}
                            autoSize={{ minRows: 3, maxRows: 3 }}
                            onChange={changeNote}
                        />
                    </Descriptions.Item>
                </Descriptions>

                <Row justify="end" style={{ marginTop: 10 }}>
                    <Col >
                        <Button htmlType="button" onClick={onClose}>
                            返回
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={onSubmit} type="primary" htmlType="button" style={{ marginLeft: 10 }}>
                            结算
            </Button>
                    </Col>
                </Row>

            </div>

        </Modal >
    );
}

export default CommissionModel;
