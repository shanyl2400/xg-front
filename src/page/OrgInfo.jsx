import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { getOrgAPI } from '../api/api';
const { TextArea } = Input;

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 12, span: 16 },
};
function OrgInfo(props) {
    const [form] = Form.useForm();
    let history = useHistory();
    let [orgInfo, setOrgInfo] = useState({});

    let id = sessionStorage.getItem("org_id");

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
        for (let i = 0; i < subjects.length; i++) {
            ret.push({ id: i + 1, name: subjects[i], value: subjects[i] });
        }
        return ret;
    }
    console.log(">>>>", orgInfo.sub_orgs)

    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>机构管理</Breadcrumb.Item>
                <Breadcrumb.Item>修改机构</Breadcrumb.Item>
            </Breadcrumb>
            <Form {...layout}
                name="control-ref"
                style={{ marginTop: "30px", marginLeft: "-40px" }}
                form={form}
            >
                <Form.Item name="name" label="机构名称" rules={[{ required: true }]} >
                    {orgInfo.name}
                </Form.Item>

                <Form.Item name="telephone" label="联系方式" rules={[{ required: true }]} >
                    {orgInfo.telephone}
                </Form.Item>

                <Form.Item name="addressData" label="机构地址" rules={[{ required: true }]} >
                    {orgInfo.address}{orgInfo.address_ext}
                </Form.Item>

                <Form.Item name="subOrgs" label="分校" rules={[{ required: false }]} >
                    <SubOrgInfoTable mode="form" value={orgInfo.sub_orgs} editable={false} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button onClick={() => { history.goBack() }} htmlType="button">
                        返回
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default OrgInfo;
