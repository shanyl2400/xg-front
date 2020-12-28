import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Input } from 'antd';
import NewIntentSubjects from './NewIntentSubjects';
import SubOrgEditModelAddress from './SubOrgEditModelAddress';
import { listSubjectsAllAPI, listSubjectsTreeAPI } from '../api/api';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 16, span: 16 },
};
function SubOrgEditModel(props) {
    const [orgInfo, setOrgInfo] = useState({})
    const [form] = Form.useForm();

    const [subjects, setSubjects] = useState([]);
    const [subjectsTree, setSubjectsTree] = useState([]);
    useEffect(() => {
        const fetchData = async () => {

            if (props.data == null || props.data == undefined) {
                return;
            }
            for (let i = 0; i < props.data.length; i++) {
                if (props.data[i].id == props.id) {
                    setOrgInfo(props.data[i])
                    form.setFieldsValue(props.data[i]);
                }
            }
            if (subjects.length < 1) {
                let subs = await listSubjectsAllAPI();
                let subsTree = await listSubjectsTreeAPI();
                setSubjects(subs);
                setSubjectsTree(subsTree);
            }
        }

        fetchData();
    }, [props.id, props.data]);


    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    const onFinish = async values => {
        props.submitForm(props.id, values);
    }

    const onClose = e => {
        props.closeModel();
    }
    const onSubmit = e => {
        form.validateFields().then(async e => {
            let subjects = form.getFieldValue("intentSubject");
            // for (let i = 0; i < subjects.length; i++) {
            //     if (subjects[i].value.indexOf("请选择") != -1) {
            //         return;
            //     }
            // }
            console.log("subjects:", subjects);
            props.submitForm(props.id, form.getFieldsValue());
        });
    }

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

                    <Form.Item name="address" label="地址" rules={[{ required: true }]} >
                        <SubOrgEditModelAddress />
                    </Form.Item>

                    <Form.Item name="intentSubject" label="支持课程" rules={[{ required: true }]}>
                        <NewIntentSubjects subjects={subjectsTree} subjectsAll={subjects} />
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

export default SubOrgEditModel;
