import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgForm from '../component/SubOrgForm2';
import { createOrgAPI } from '../api/api';
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
function UpdateOrg(props) {
    const [form] = Form.useForm();
    let [subOrgs, setSubOrgs] = useState([]);

    let [orgData, setOrgData] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            let res = await getOrgAPI(id);
            if (res.err_msg == "success") {
                let org = res.org;
                setOrgData(org);
            } else {
                message.warning("获取机构信息失败：" + res.err_msg);
                history.goBack();
                return;
            }
        }
        fetchData();
    }, []);

    const handleAddSubOrg = (data) => {
        data.id = currentId;
        setSubOrgs(subOrgs.concat(data));
        currentId++;
    }
    const handleUpdateSubOrg = (id, data) => {
        for (let i = 0; i < subOrgs.length; i++) {
            if (id == subOrgs[i].id) {
                subOrgs[i] = data;
            }
        }
    }
    const handleRemoveSubOrg = (id) => {
        let tmpOrgs = [];
        for (let i = 0; i < subOrgs.length; i++) {
            if (subOrgs[i].id == id) {
                continue;
            } else {
                tmpOrgs.push(subOrgs[i]);
            }
        }
        setSubOrgs(tmpOrgs);
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
            for (let i = 0; i < subOrgs.length; i++) {
                let so = subOrgs[i];
                subOrgInfos = subOrgInfos.concat({
                    id: so.id >= baseId ? 0 : so.id,
                    name: so.name,
                    telephone: formData.telephone,
                    address: combineStr(so.address),
                    address: so.address.region,
                    address_ext: so.address.ext,
                    subjects: combineValue(so.intentSubject),
                })
            }
            let res = await updateOrgAPI(id, {
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
                setSubOrgs([]);
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
                initialValues={{ remember: true }}
                form={form}
            >
                <Form.Item name="name" label="机构名称" rules={[{ required: true }]} >
                    <Input value={orgData.name} />
                </Form.Item>

                <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
                    <Input value={orgData.telephone} />
                </Form.Item>

                <Form.Item name="address" label="机构地址" rules={[{ required: true }]} >
                    <AddressForm value={{ region: orgData.address, ext: orgData.address_ext }} />
                </Form.Item>

                <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
                    <SubOrgForm value={subOrgs} addSubOrg={handleAddSubOrg} removeSubOrg={handleRemoveSubOrg} updateSubOrg={handleUpdateSubOrg} />
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

export default UpdateOrg;
