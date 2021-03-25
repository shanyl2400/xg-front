import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Button, Descriptions, message } from 'antd';
import { getStudentByIdAPI } from '../api/api';

import { formatDate } from "../utils/date";
import { getStudentStatus } from "../utils/status";
function StudentDetailsModel(props) {
    const [student, setStudent] = useState({});
    let onCancel = () => {
        props.closeModel();
    }
    const fetchData = async (e, data) => {
        let res = await getStudentByIdAPI(props.id);
        if (res.err_msg == "success") {
            setStudent(res.student);
        } else {
            message.error("获取录单信息失败，" + res.err_msg);
            return
        }
    }

    useEffect(() => {
        fetchData();
    }, [props.id]);
    return (
        <Modal
            title="录单信息"
            visible={props.visible}
            footer={null}
            onCancel={onCancel}
            width={600}
        >
            <Descriptions bordered >
                <Descriptions.Item label="学员姓名" span={3}>{student.name}</Descriptions.Item>
                <Descriptions.Item label="家庭住址" span={3}>{student.address}{student.address_ext}</Descriptions.Item>
                <Descriptions.Item label="录单员" span={3}>{student.authorName}</Descriptions.Item>
                <Descriptions.Item label="录单时间" span={3}>{student.created_at ? formatDate(new Date(Date.parse(student.created_at))) : ""}</Descriptions.Item>
                <Descriptions.Item label="电话" span={3}>{student.telephone}</Descriptions.Item>
                <Descriptions.Item label="订单来源" span={3}>{student.order_source_name}</Descriptions.Item>
                <Descriptions.Item label="状态" span={3}>{getStudentStatus(student.status)}</Descriptions.Item>
                <Descriptions.Item label="备注" span={3}>{student.note}</Descriptions.Item>
            </Descriptions>

            <Row justify="end" style={{ marginTop: 30 }}>
                <Col >
                    <Button onClick={onCancel}>确定</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default StudentDetailsModel;
