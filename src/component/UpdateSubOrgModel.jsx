import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Cascader } from 'antd';
import IntentSubjectForm from './IntentSubjectForm';
import AddressForm from './AddressForm2';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 17, span: 16 },
};
function UpdateSubOrgModel(props) {
    const [form] = Form.useForm();

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    const onFinish = async values => {
        props.submitForm(props.value.id, values);
    }
    const onClose = e => {
        props.closeModel();
    }

    const onSubmit = e => {
        form.validateFields().then(async e => {
            let subjects = form.getFieldValue("intentSubject");
            for (let i = 0; i < subjects.length; i++) {
                if (subjects[i].value.indexOf("请选择") != -1) {
                    return;
                }
            }
            props.submitForm(props.value.id, form.getFieldsValue());
            // form.resetFields();
        });
    }

    form.setFieldsValue(props.value);
    return (
        <Modal
            title="修改分校"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ padding: 20, height: "100%", width: "100%" }}>
                <Form {...layout}
                    name="control-ref"
                    style={{ marginTop: "0px", marginLeft: "-40px" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    form={form}>
                    <Form.Item name="name" label="分校名称" rules={[{ required: true }]} >
                        <Input />
                    </Form.Item>

                    <Form.Item name="addressData" label="地址" rules={[{ required: true }]} >
                        <AddressForm />
                    </Form.Item>

                    <Form.Item name="intentSubject" label="支持课程" rules={[{ required: true }]}>
                        <IntentSubjectForm subjects={props.subjects} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button htmlType="button" onClick={onClose}>
                            返回
            </Button>
                        <Button onClick={onSubmit} type="primary" htmlType="button" style={{ marginLeft: 10 }}>
                            修改
            </Button>
                    </Form.Item>
                </Form>
            </div>

        </Modal>
    );
}

export default UpdateSubOrgModel;
