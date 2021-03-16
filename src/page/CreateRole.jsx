import React, { useState, useEffect } from 'react';
import { Breadcrumb, Input, Form, Button, Checkbox, message } from 'antd';
import { listAuths, createRole } from "../api/api";
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 12, span: 16 },
};
const options = [
  { label: '录单', value: '录单' },
  { label: '派单', value: '派单' },
  { label: '人员管理', value: '人员管理' },
];

function CreateRole(props) {
  const [form] = Form.useForm();
  const [auths, setAuths] = useState([])
  const [roleName, setRoleName] = useState("")
  const handleChange = e => {
    setRoleName(e.target.value)
  }
  const handleAddRole = async e => {
    let res = await createRole(form.getFieldsValue());
    if (res.err_msg == "success") {
      console.log(res);
      message.success("创建角色成功");
      form.resetFields();
    } else {
      message.error("创建角色失败，" + res.err_msg);
      return
    }
  }

  const fetchData = async e => {
    let res = await listAuths();
    if (res.err_msg == "success") {
      console.log(res.auths);
      let auths = [];
      for (let i = 0; i < res.auths.length; i++) {
        auths = auths.concat({
          key: res.auths[i].id,
          label: res.auths[i].name,
          value: res.auths[i].id,
        })
      }

      setAuths(auths);
    } else {
      message.error("获取用户列表失败，" + res.err_msg);
      return
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加角色</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout}
        name="control-ref"
        style={{ marginTop: "30px", marginLeft: "-40px" }}
        initialValues={{ remember: true }}
        form={form}>
        <Form.Item name="name" label="角色名" rules={[{ required: true }]} >
          <Input style={{ width: 220 }} onChange={handleChange} />
        </Form.Item>

        <Form.Item name="auth_ids" label="权限" rules={[{ required: true }]} >
          <Checkbox.Group options={auths} defaultValue={['人员管理']} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button onClick={handleAddRole} htmlType="button">
            保存
          </Button>

        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateRole;
