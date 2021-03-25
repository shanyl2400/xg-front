import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Button, message, InputNumber, Form, Select } from 'antd';
import { getOrderStatus } from '../utils/status';
import { getOrderAPI, signupOrderAPI } from '../api/api';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function OrderSignupModel(props) {
    let onCancel = () => {
        props.closeModel();
    }
    let [orderInfo, setOrderInfo] = useState({
        student_summary: {
            name: "",
            gender: false,
        },
        intent_subject: [],
        PaymentInfo: [],
    })
    const [form] = Form.useForm();
    let onSubmit = async () => {
        form.validateFields().then(async e => {
            let amount = Number(form.getFieldValue("amount"));
            let res = await signupOrderAPI(props.id, {
                title: "学费",
                amount: amount
            });
            if (res.err_msg == "success") {
                message.success("名单已报名");
                props.closeModel();
                props.refreshData();
            } else {
                message.error("报名失败" + res.err_msg);
            }
            form.resetFields();
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            if (props.id == 0) {
                return;
            }
            let res = await getOrderAPI(props.id);
            console.log(res)
            if (res.err_msg == "success") {
                setOrderInfo(res.data);
            } else {
                message.warning("获取订单信息失败：" + res.err_msg);
                return;
            }
        }
        fetchData();
    }, [props.id]);
    return (
        <Modal
            title="报名"
            visible={props.visible}
            footer={null}
            onCancel={onCancel}
        >
            <Card style={{ width: "100%", margin: "5px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>姓名：{orderInfo.student_summary.name}</Col>
                    <Col span={12}>派单员：{orderInfo.publisher_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>推荐机构：{orderInfo.org_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名：
                        <ul style={{ margin: "10px 10px" }}>
                            {orderInfo.intent_subject.map((v, id) =>
                                <li key={id}>{v}</li>
                            )}
                        </ul>

                    </Col>
                </Row>
                <Row gutter={[16, 16]} key={1}>
                    <Col span={12}>状态：{getOrderStatus(orderInfo.status)}</Col>
                </Row>
            </Card>

            <Form {...layout}
                name="control-ref"
                style={{ marginTop: "30px", marginLeft: "-40px" }}
                initialValues={{ remember: true }}
                form={form}>
                {/* <Form.Item name="title" label="名目">
                    <Select onSelect={handleSelectTitle} placeholder="请选择" style={{ width: 120 }} defaultValue={"学费"} value={titleValue}>
                        <Option value={"学费"}>学费</Option>
                        <Option value={"定金"}>定金</Option>
                    </Select>
                 </Form.Item> */}
                <Form.Item name="amount" label="金额" rules={[{ required: true }]} >
                    <InputNumber placeholder="请输入报名交费" style={{ width: 220 }} />
                </Form.Item>
            </Form>

            <Row style={{ marginTop: 30 }}>
                <Col offset={15} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onSubmit} type="primary">报名</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default OrderSignupModel;
