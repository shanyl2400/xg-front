import React, { useState, useEffect } from 'react';
import { Breadcrumb, Input, Form, Button, Checkbox, message, Select, Modal } from 'antd';
import { listAuths, createRole } from "../api/api";
import { PlusCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
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
  const [auths, setAuths] = useState([]);
  const [roleName, setRoleName] = useState("")
  const [roleMode, setRoleMode] = useState(1)
  const [authOptions, setAuthOptions] = useState([])
  const handleChange = e => {
    setRoleName(e.target.value)
  }
  const handleAddRole = e => {
    form.validateFields().then(() => {
      confirm({
        title: '确认创建角色?',
        icon: <PlusCircleOutlined />,
        content: '创建角色可能会导致角色功能不完整，确认创建角色？',
        async onOk() {
          let data = form.getFieldsValue();
          data.role_mode = roleMode;
          let res = await createRole(data);
          if (res.err_msg == "success") {
            console.log(res);
            message.success("创建角色成功");
            form.resetFields();
          } else {
            message.error("创建角色失败，" + res.err_msg);
            return
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });

    }).catch(e => {

    })

  }

  const handleChangeRoleMode = e => {
    setRoleMode(e);
    filterAuth(auths, e);
  }

  const filterAuth = (auths, mode) => {
    let options = [];
    for (let i = 0; i < auths.length; i++) {
      if (auths[i].mode == mode) {
        options = options.concat({
          key: auths[i].id,
          label: auths[i].name,
          value: auths[i].id,
        })
      }
    }
    setAuthOptions(options);
  }

  const fetchData = async e => {
    let res = await listAuths();
    if (res.err_msg == "success") {
      console.log(res.auths);
      setAuths(res.auths);
      filterAuth(res.auths, 1);
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

        <Form.Item name="role_mode" label="角色归属" rules={[{ required: false }]} >
          <Select style={{ width: 220 }} defaultValue={1} value={roleMode} onChange={handleChangeRoleMode}>
            <Select.Option value={1}>学果网</Select.Option>
            <Select.Option value={2}>入驻机构</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="auth_ids" label="权限" rules={[{ required: false }]} >
          <Checkbox.Group options={authOptions} defaultValue={['人员管理']} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button onClick={handleAddRole} htmlType="button" type="primary">
            创建
          </Button>

        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateRole;
