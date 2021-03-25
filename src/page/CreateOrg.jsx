import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, InputNumber, Cascader, Select, message } from 'antd';
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { createOrgAPI } from '../api/api';
import AddressForm from '../component/AddressForm';
import OrgCertification from '../component/OrgCertification';
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
  const [certificationInfo, setCertificationInfo] = useState({
    businessLicense: null,
    entityIdentity: null,
    schoolPermission: null
  });
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
      let request = {
        org: {
          name: formData.name,
          telephone: formData.telephone,
          address: formData.address.region,
          address_ext: formData.address.ext,
          valid_month: formData.valid_month,
          settlement_instruction: formData.settlement_instruction,
        },
        sub_orgs: subOrgInfos
      }
      request = buildCertification(request);
      let res = await createOrgAPI(request)
      if (res.err_msg == "success") {
        message.success("机构添加成功");
        form.resetFields();
        subOrgs = [];
      } else {
        message.error("机构添加失败");
      }
      setCertificationInfo({
        businessLicense: null,
        entityIdentity: null,
        schoolPermission: null
      });

    });
  }
  const buildCertification = req => {
    req.org.business_license = certificationInfo.businessLicense == null ? "" : certificationInfo.businessLicense.source;
    req.org.corporate_identity = certificationInfo.entityIdentity == null ? "" : certificationInfo.entityIdentity.source;
    req.org.school_permission = certificationInfo.schoolPermission == null ? "" : certificationInfo.schoolPermission.source;
    return req;
  }
  const updateSubOrgs = (orgs) => {
    subOrgs = orgs;
  }
  const handleBusinessLicense = source => {
    setCertificationInfo({
      entityIdentity: certificationInfo.entityIdentity,
      businessLicense: source,
      schoolPermission: certificationInfo.schoolPermission,
    });
  }
  const handleEntityIdentity = source => {
    setCertificationInfo({
      businessLicense: certificationInfo.businessLicense,
      entityIdentity: source,
      schoolPermission: certificationInfo.schoolPermission,
    });
  }
  const handleSchoolPermission = source => {
    setCertificationInfo({
      businessLicense: certificationInfo.businessLicense,
      entityIdentity: certificationInfo.entityIdentity,
      schoolPermission: source,
    });
  }
  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加机构</Breadcrumb.Item>
      </Breadcrumb>
      <Form {...layout}
        name="control-ref"
        style={{ marginTop: "30px", marginLeft: "-40px" }}
        initialValues={{ remember: true, valid_month: 12 }}
        form={form}
      >
        <Form.Item name="name" label="机构名称" rules={[{ required: true }]} >
          <Input />
        </Form.Item>

        <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
          <Input />
        </Form.Item>

        <Form.Item name="address" label="机构地址" rules={[{ required: true }]} >
          <AddressForm />
        </Form.Item>

        <Form.Item name="valid_month" label="有效期" rules={[{ required: true }]} >
          <InputNumber
            min={1}
            max={100}
            formatter={value => `${value}个月`}
            parser={value => value.replace('个月', '')}
          />
        </Form.Item>

        <Form.Item name="settlement_instruction" label="结算说明" rules={[{ required: false }]} >
          <TextArea
            autoSize={{ minRows: 3, maxRows: 3 }}
          />
        </Form.Item>
        <Form.Item label="资质信息" rules={[{ required: true }]} >
          <OrgCertification
            businessLicense={certificationInfo.businessLicense}
            entityIdentity={certificationInfo.entityIdentity}
            schoolPermission={certificationInfo.schoolPermission}
            updateBusinessLicense={handleBusinessLicense}
            updateEntityIdentity={handleEntityIdentity}
            updateSchoolPermission={handleSchoolPermission}
          />
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
