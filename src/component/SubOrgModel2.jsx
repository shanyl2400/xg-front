import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import IntentSubjectForm from './IntentSubjectForm';
import AddressForm from './AddressForm';
import { listSubjects } from '../api/api';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 16, span: 16 },
};
let index = 0;
function SubOrgModel(props) {
    const [form] = Form.useForm();

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    const onFinish = async values => {
        props.submitForm(values);
    }
    const onClose = e => {
        props.closeModel();
    }

    const onSubmit = e => {
        form.validateFields().then(async e => {
            let subjects = form.getFieldValue("intentSubject");
            for (let i = 0; i < subjects.length; i++) {
                if (subjects[i].value.indexOf("请选择") != -1) {
                    message.warn("请选择支持课程");
                    return;
                }
            }
            let data = form.getFieldsValue();
            data.address = data.addressData.region;
            data.address_ext = data.addressData.ext;
            props.submitForm(data);
            form.resetFields();
        });
    }
    return (
        <Modal
            title="添加分校22"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ padding: 20, height: "100%", width: "100%" }}>
                <Form {...layout}
                    name="control-ref"
                    style={{ marginTop: "0px", marginLeft: "-40px" }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    form={form}
                    initialValues={{
                        gender: true,
                        intentSubject: [{
                            id: index,
                            value: "请选择-请选择-普通课"
                        }],
                    }}>
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
                            添加
            </Button>
                    </Form.Item>
                </Form>
            </div>

        </Modal>
    );
}

export default SubOrgModel;
