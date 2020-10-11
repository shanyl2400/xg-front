import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgForm from '../component/SubOrgForm2';
import { getOrgAPI, updateOrgSelfAPI } from '../api/api';
import AddressForm from '../component/AddressForm2';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 12, span: 16 },
};
let baseId = 100000000;
function UpdateOrgSelf(props) {
    const [form] = Form.useForm();
    let history = useHistory();
    let [orgInfo, setOrgInfo] = useState({});

    let id = sessionStorage.getItem("org_id");

    useEffect(() => {
        const fetchData = async () => {
            let res = await getOrgAPI(id);
            if (res.err_msg == "success") {
                let org = res.org;
                for(let i = 0; i < org.sub_orgs.length; i ++){
                    let nameParts = org.sub_orgs[i].name.split("-");
                    org.sub_orgs[i].name = nameParts[nameParts.length - 1];
                    org.sub_orgs[i].intentSubject = getIntentSubjects(org.sub_orgs[i].subjects);
                }
                setOrgInfo(res.org);
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
        for(let i = 0; i < subjects.length; i ++){
                ret.push({id: i + 1, name: subjects[i], value: subjects[i]});
        }
        return ret;
    }

    const combineStr = (strList) => {
        let ret = ""
        for (let i = 0; i < strList.length; i++) {
            ret = ret + strList[i];
        }
        return ret
    }
    const combineValue = (obj) => {
        let ret = []
        for (let i = 0; i < obj.length; i++) {
            ret = ret.concat(obj[i].value);
        }
        return ret
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
                    subjects: combineValue(so.intentSubject),
                })
            }
            let res = await updateOrgSelfAPI({
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
                    {orgInfo.name}
                </Form.Item>

                <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
                    <Input/>
                </Form.Item>

                <Form.Item name="addressData" label="机构地址" rules={[{ required: true }]} >
                    <AddressForm />
                </Form.Item>

                <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
                    <SubOrgForm />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button onClick={()=>{history.goBack()}} htmlType="button">
                        返回
                    </Button>
                    <Button style={{marginLeft:10}} type="primary" onClick={handleSubmit} htmlType="button">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default UpdateOrgSelf;
