import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import IntentSubjectForm from './IntentSubjectForm';
import AddressForm from './AddressForm';
import { listSubjects } from '../api/api';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 17, span: 16 },
};
let index = 0;
function SubOrgModel(props) {
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState([])

  async function getSubjects() {
    let subjects = [];
    if (subjects.length < 1) {
      let rawSubjects = await listSubjects();
      for (let i = 0; i < rawSubjects.length; i++) {
        if (rawSubjects[i].level == 1) {
          subjects = subjects.concat({
            id: rawSubjects[i].id,
            parent_id: rawSubjects[i].parent_id,
            level: rawSubjects[i].level,
            name: rawSubjects[i].name,
            children: []
          })
        }
      }

      for (let i = 0; i < rawSubjects.length; i++) {
        if (rawSubjects[i].level == 2) {
          for (let j = 0; j < subjects.length; j++) {
            if (rawSubjects[i].parent_id == subjects[j].id) {
              subjects[j].children = subjects[j].children.concat({
                id: rawSubjects[i].id,
                parent_id: rawSubjects[i].parent_id,
                level: rawSubjects[i].level,
                name: rawSubjects[i].name,
              })
            }
          }
        }
      }
    }
    return subjects
  }

  useEffect(() => {
    const fetchData = async () => {
      const sub = await getSubjects();
      setSubjects(sub);
    }
    fetchData();
  }, [])
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
      props.submitForm(form.getFieldsValue());
      form.resetFields();
    });
  }
  return (
    <Modal
      title="添加分校"
      visible={props.visible}
      footer={null}
      onCancel={onClose}
    >   <div style={{ padding: 20, height: "100%", width: "100%" }}>
        <Form {...layout}
          name="control-ref"
          style={{ marginTop: "0px", marginLeft: "-40px" }}
          initialValues={{ remember: true }}
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

          <Form.Item name="address" label="地址" rules={[{ required: true }]} >
            <AddressForm />
          </Form.Item>

          <Form.Item name="intentSubject" label="支持课程" rules={[{ required: true }]}>
            <IntentSubjectForm subjects={subjects} />
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
