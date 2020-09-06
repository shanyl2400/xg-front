import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import {updatePasswordAPI} from '../api/api'

const layout = {
    labelCol: { offset:2, span: 4 },
    wrapperCol: { span: 10 },
  };
function UpdatePasswordModel(props) {
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [invalidPasswordMessage, setInvalidPasswordMessage] = useState("")
    const [form] = Form.useForm();
    const onFinish = values => {
      console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };
    let handleOk = () => {
        setConfirmLoading(true);
        //判断密码一致性
        if(form.getFieldValue("new_password") != form.getFieldValue("confirm_password")) {
            setInvalidPasswordMessage("密码不一致");
            setConfirmLoading(false);
            return;
        }
        // form.submit();
        updatePasswordAPI(form.getFieldValue("new_password")).then(res=>{
            if(res.err_msg == "success"){
                message.success("密码修改成功")
            }else{
                message.success("密码修改失败：" + res.err_msg);
            }
            setConfirmLoading(false);
            props.handleCancel();
            form.resetFields();
        }).catch(err=>{
            console.log("err:", err);
            setInvalidPasswordMessage("密码更新失败");
            setConfirmLoading(false);
            form.resetFields();
        })
        setTimeout(() => {
            
        }, 2000);
    };

    let handleCancel = () => {
        props.handleCancel();
    };
    return (
        <Modal
            title="修改密码"
            visible={props.visible}
            onOk={handleOk}
            confirmLoading={confirmLoading}
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
                <Form.Item name="new_password" label="新密码" rules={[{ required: true }]} >
                    <Input.Password  />
                </Form.Item>
                <Form.Item 
                    validateStatus={invalidPasswordMessage != ""?"error":""}
                    help={invalidPasswordMessage}
                    name="confirm_password" 
                    label="确认密码" 
                    rules={[{ required: true }]} >
                    <Input.Password  />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UpdatePasswordModel;
