import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { updateOrderSourcesAPI } from '../api/api'

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function UpdateOrderSourceModel(props) {
    const [form] = Form.useForm();
    const onFinish = values => {
        console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    let handleOk = async () => {
        let res = await updateOrderSourcesAPI(props.id, form.getFieldValue("name"));
        if (res.err_msg == "success") {
            message.success("修改成功");
            props.handleCancel();
            props.refresh();
        } else {
            message.error("修改失败，" + res.err_msg);
        }
    };

    let handleCancel = () => {
        props.handleCancel();
    };
    return (
        <Modal
            title="修改订单来源"
            visible={props.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            form={form}
        >
            <Form {...layout}
                name="control-ref"
                style={{ marginTop: "30px", marginLeft: "-40px" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
            >
                <Form.Item name="name" label="来源名称" rules={[{ required: true }]} >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UpdateOrderSourceModel;
