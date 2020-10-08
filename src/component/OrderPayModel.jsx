import React, { useState, useEffect } from 'react';
import { Modal, Card, Row, Col, Button, message, Input, Form, Select, InputNumber  } from 'antd';
import { getOrderStatus } from '../utils/status';
import { getOrderAPI, payOrderAPI} from '../api/api';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
const { Option } = Select;
function OrderPayModel(props) {
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
    const [modeValue, setModeValue] = useState(1)
    const [form] = Form.useForm();
    let onSubmit = async () => {
       
        form.validateFields().then(async e=>{
            let amount = Number(form.getFieldValue("amount"));
            let title = form.getFieldValue("title");
            let mode = modeValue;
            let res = await payOrderAPI(props.id, {
                title: title,
                mode: mode,
                amount: amount
            });
            if(res.err_msg == "success"){
                message.success("提交成功");
                props.closeModel();
                props.refreshData();
            }else{
                message.error("提交失败" + res.err_msg);
            }
            form.resetFields();
          });
    }

    const handleSelectMode = e => {
        setModeValue(e);
    }
    useEffect(() => {
        const fetchData = async () => {
            if(props.id == 0){
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
            title="缴退费"
            visible={props.visible}
            footer={null}
        >
            <Card style={{ width: "100%", margin: "5px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>姓名：{orderInfo.student_summary.name}</Col>
                    <Col span={12}>代理人：{orderInfo.publisher_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>推荐机构：{orderInfo.org_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名：
                        <ul style={{ margin: "10px 10px" }}>
                            {orderInfo.intent_subject.map((v, id)=>
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
                <Form.Item name="mode" label="类型">
                    <Select onSelect={handleSelectMode} placeholder="请选择" style={{ width: 120 }} defaultValue={1} value={modeValue}>
                        <Option value={1}>缴费</Option>
                        <Option value={2}>退费</Option>
                    </Select>
                 </Form.Item>
                 <Form.Item name="title" label="名目" rules={[{ required: true }]} >
                    <Input placeholder="请输入费用名目" style={{ width: 220 }}/>
                </Form.Item>
                <Form.Item name="amount" label="金额" rules={[{ required: true }]} >
                    <InputNumber placeholder="请输入报名交费" style={{ width: 220 }}/>
                </Form.Item>
            </Form>

            <Row style={{marginTop:30}}>
                <Col offset={15} span={4}>
                    <Button onClick={onCancel}>取消</Button>
                </Col>
                <Col span={4}>
                    <Button onClick={onSubmit} type="primary">提交</Button>
                </Col>
            </Row>
        </Modal>
    );
}

export default OrderPayModel;
