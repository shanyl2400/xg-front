import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, Radio, Cascader, Select, message } from 'antd';
import options from '../component/address';
import SubOrgForm from '../component/SubOrgForm';
import { createOrgAPI } from '../api/api';
const { TextArea } = Input;

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 12, span: 16 },
};
let currentId = 1;
function CreateOrg(props) {
  const [form] = Form.useForm();
  let [subOrgs, setSubOrgs] = useState([]);

  const handleAddSubOrg = (data) => {
    data.id = currentId;
    setSubOrgs(subOrgs.concat(data));
    currentId ++;
  }
  const handleRemoveSubOrg = (id) => {
      let tmpOrgs = [];
      for(let i = 0; i < subOrgs.length; i ++){
          if(subOrgs[i].id == id){
              continue;
          }else{
              tmpOrgs.push(subOrgs[i]);
          }
      }
      setSubOrgs(tmpOrgs);
  }
  const combineStr = (strList) => {
    let ret = ""
    for(let i = 0; i < strList.length; i ++){
      ret = ret + strList[i];
    }
    return ret
  }
  const combineValue = (obj) => {
    let ret = []
    for(let i = 0; i < obj.length; i ++){
      ret = ret.concat(obj[i].value);
    }
    return ret
  }
  const handleSubmit = () => {
    form.validateFields().then(async e =>{
      let formData = form.getFieldsValue();
      let address = combineStr(formData.address);
      let subOrgInfos = [];
      for(let i = 0; i < subOrgs.length; i ++){
        let so = subOrgs[i];
        subOrgInfos = subOrgInfos.concat({
          name: so.name,
          telephone: formData.telephone,
          address: combineStr(so.address),
          subjects: combineValue(so.intentSubject),
        })
      }
      let res = await createOrgAPI({
        org:{
          name:formData.name,
          telephone: formData.telephone,
          address: address
        },
        sub_orgs: subOrgInfos
      })
      if(res.err_msg == "success"){
        message.success("机构添加成功");
        form.resetFields();
        setSubOrgs([]);
      }else{
        message.error("机构添加失败");
      }

    });
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
          <Cascader options={options} placeholder="请选择" />
        </Form.Item>

        <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
          <SubOrgForm subOrgs={subOrgs} addSubOrg={handleAddSubOrg} removeSubOrg={handleRemoveSubOrg}/>
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
