import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, Radio, Cascader, Select, message } from 'antd';
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { createOrgAPI } from '../api/api';
import AddressForm from '../component/AddressForm';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 12, span: 16 },
};
function CreateOrg(props) {
  const [form] = Form.useForm();
  let subOrgs = [];

  const combineStr = (strList) => {
    let ret = ""
    for (let i = 0; i < strList.length; i++) {
      ret = ret + strList[i];
    }
    return ret
  }

  const handleSubmit = () => {
    form.validateFields().then(async e => {
      let formData = form.getFieldsValue();
      let subOrgInfos = [];
      for (let i = 0; i < subOrgs.length; i++) {
        let so = subOrgs[i];
        subOrgInfos = subOrgInfos.concat({
          name: so.name,
          telephone: formData.telephone,
          address: combineStr(so.address),
          address: so.address.region,
          address_ext: so.address.ext,
          subjects: so.intentSubject,
        })
      }
      console.log("suborgs:", subOrgInfos);

      let res = await createOrgAPI({
        org: {
          name: formData.name,
          telephone: formData.telephone,
          address: formData.address.region,
          address_ext: formData.address.ext,
        },
        sub_orgs: subOrgInfos
      })
      if (res.err_msg == "success") {
        message.success("机构添加成功");
        form.resetFields();
        subOrgs = [];
      } else {
        message.error("机构添加失败");
      }

    });
  }
  const updateSubOrgs = (orgs) => {
    subOrgs = orgs;
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加机构</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout}
        name="control-ref"
        style={{ marginTop: "30px", marginLeft: "-40px" }}
        initialValues={{ remember: true }}
        form={form}
      >
        <Form.Item name="name" label="机构名称" rules={[{ required: true }]} >
          <Input />
        </Form.Item>

        <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
          <Input />
        </Form.Item>

        <Form.Item name="address" label="机构地址" rules={[{ required: true }]} >
          {/* <Cascader options={options} placeholder="请选择" /> */}
          <AddressForm />
        </Form.Item>

        <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
          <SubOrgInfoTable updateSubOrgs={updateSubOrgs} mode="state" editable={true} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" onClick={handleSubmit} htmlType="button">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateOrg;
