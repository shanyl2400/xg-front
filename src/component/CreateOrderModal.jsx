import React, { useState, useEffect } from 'react';
import {  Button, Modal, Select, Row, Col, message } from 'antd';
import { createOrderAPI } from '../api/api';

const { Option } = Select;
function CreateOrderModal(props) {
    const [subject, setSubject] = useState("")

    const onClose = e => {
        setSubject("");
        props.closeModel();
    }

    const onSubmit = async e => {
        if (subject == "") {
            message.warn("请选择派单科目");
            return;
        }
        let res = await createOrderAPI({
            student_id: parseInt(props.studentId),
            to_org_id: props.org.id,
            intent_subjects: [subject],
        })
        console.log(res)
        if (res.err_msg == "success") {
            message.success("派单成功");
            onClose();
        } else {
            message.error("派单失败");
            onClose();
        }
    }

    const handleChangeSubject = e => {
        setSubject(e);
    }
    return (
        <Modal
            title="派单"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ padding: 20, height: "100%", width: "100%" }}>
                <Row style={{ marginBottom: 30 }}>
                    <Col>派单科目：</Col>
                    <Col span={15}>
                        <Select style={{ width: "100%" }} placeholder="请选择派单科目" value={subject} onChange={handleChangeSubject}>
                            {props.org != null && props.org.subjects.map((v) =>
                                <Option value={v} key={v}>{v}</Option>
                            )}
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col offset={16}>
                        <Button htmlType="button" onClick={onClose}>
                            返回
                        </Button>
                    </Col>
                    <Col>
                        <Button onClick={onSubmit} type="primary" htmlType="button" style={{ marginLeft: 10 }}>
                            派单
            </Button>
                    </Col>
                </Row>

            </div>

        </Modal>
    );
}

export default CreateOrderModal;
