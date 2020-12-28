import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { getOrgAPI, updateOrgSelfAPI } from '../api/api';
import SubOrgEditModelAddress from '../component/SubOrgEditModelAddress';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 12, span: 16 },
};
let baseId = 100000000;
function UpdateOrg(props) {
    const [form] = Form.useForm();
    let history = useHistory();

    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            let res = await getOrgAPI(id);
            if (res.err_msg == "success") {
                let org = res.org;
                for (let i = 0; i < org.sub_orgs.length; i++) {
                    let nameParts = org.sub_orgs[i].name.split("-");
                    org.sub_orgs[i].name = nameParts[nameParts.length - 1];
                    org.sub_orgs[i].intentSubject = getIntentSubjects(org.sub_orgs[i].subjects);
                }

                form.setFieldsValue({
                    name: org.name,
                    telephone: org.telephone,
                    address: { region: org.address, ext: org.address_ext },
                    addressData: { region: org.address, ext: org.address_ext },
                    subOrgs: org.sub_orgs,
                })
            } else {
                message.warning("获取机构信息失败：" + res.err_msg);
                history.goBack();
                return;
            }
        }
        fetchData();
    }, []);

    const getIntentSubjects = (subjects) => {
        let ret = [];
        if (subjects == null) {
            return [];
        }
        for (let i = 0; i < subjects.length; i++) {
            ret.push(subjects[i]);
        }
        return ret;
    }



    const handleSubmit = () => {
        form.validateFields().then(async e => {
            let formData = form.getFieldsValue();
            let subOrgInfos = [];
            console.log(formData);
            for (let i = 0; i < formData.subOrgs.length; i++) {
                let so = formData.subOrgs[i];
                subOrgInfos = subOrgInfos.concat({
                    id: so.id >= baseId ? 0 : so.id,
                    name: so.name,
                    telephone: formData.telephone,
                    // address: combineStr(so.address),
                    address: so.address,
                    address_ext: so.address_ext,
                    subjects: so.subjects,
                })
            }
            let res = await updateOrgSelfAPI(id, {
                org: {
                    name: formData.name,
                    telephone: formData.telephone,
                    address: formData.addressData.region,
                    address_ext: formData.addressData.ext,
                },
                sub_orgs: subOrgInfos
            })
            if (res.err_msg == "success") {
                message.success("机构添加成功");
                history.goBack();
            } else {
                message.error("机构添加失败");
            }

        });
    }
    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>机构管理</Breadcrumb.Item>
                <Breadcrumb.Item>修改机构</Breadcrumb.Item>
            </Breadcrumb>
            <Form {...layout}
                name="control-ref"
                style={{ marginTop: "30px", marginLeft: "-40px" }}
                initialValues={{
                    // name: orgData.name,
                    // telephone: orgData.telephone,
                    addressData: { region: "", ext: "" },
                    // subOrgs: orgData.subOrgs
                }}
                form={form}
            >
                <Form.Item name="name" label="机构名称" rules={[{ required: true }]} >
                    <Input />
                </Form.Item>

                <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
                    <Input />
                </Form.Item>

                <Form.Item name="addressData" label="机构地址" rules={[{ required: true }]} >
                    <SubOrgEditModelAddress />
                </Form.Item>

                <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
                    <SubOrgInfoTable mode="form" editable={true} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button onClick={() => { history.goBack() }} htmlType="button">
                        返回
                    </Button>
                    <Button style={{ marginLeft: 10 }} type="primary" onClick={handleSubmit} htmlType="button">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateOrg;
