import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, Select, message } from 'antd';
import {listRolesAPI, listOrgsAPI, createUserAPI} from '../api/api';
const { Option } = Select;
const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 7, span: 16 },
};
function CreateUser(props) {
  const [form] = Form.useForm();
  const [selectForms, setSelectForms] = useState({
    roles: [],
    orgs: [],
  })
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async values => {
    console.log(values)
  }

  const fetchData = async e => {
    let res = await listRolesAPI();
    let roles = [];
    let orgs = []
    if(res.err_msg == "success"){
      roles = res.roles;
    }else{
      message.error("获取角色列表失败，", res.err_msg);
      return
    }

    let res2 = await listOrgsAPI();
    if(res2.err_msg == "success"){
      orgs = res2.data.orgs;
    }else{
      message.error("获取角色列表失败，", res2.err_msg);
      return
    }
    setSelectForms({
        roles: roles,
        orgs: orgs,
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async e => {
    console.log(form.getFieldsValue())
    console.log(selectForms.roles);
    let res = await createUserAPI(form.getFieldsValue())
    if(res.err_msg == "success"){
      form.resetFields();
      message.success("添加角色成功");
    }else{
      message.error("添加角色失败，", res.err_msg);
    }
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
     <Breadcrumb>
        <Breadcrumb.Item>学员管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加用户</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout}
        name="control-ref"
        style={{ marginTop: "30px", marginLeft: "-40px" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}>
        <Form.Item name="name" label="账号" rules={[{ required: true }]} >
          <Input style={{ width: 220 }}/>
        </Form.Item>

        <Form.Item name="org_id" label="机构" rules={[{ required: true }]} >
        <Select placeholder="请选择" style={{ width: 220 }} >
            {selectForms.orgs.map((v)=>
            <Option key={v.id} value={v.id}>{v.name}</Option>
            )}
        </Select>
        </Form.Item>

        <Form.Item name="role_id" label="角色" rules={[{ required: true }]} >
        <Select placeholder="请选择" style={{ width: 220 }} >
            {selectForms.roles.map((v)=>
            <Option key={v.id} value={v.id}>{v.name}</Option>
            )}
        </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button htmlType="submit" onClick={handleAddUser}>
            保存
          </Button>
          
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateUser;
