import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, Typography, Descriptions, Row, Col, message } from 'antd';
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
const { Title } = Typography;
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

    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>机构管理</Breadcrumb.Item>
                <Breadcrumb.Item>修改机构</Breadcrumb.Item>
            </Breadcrumb>

            <Descriptions title="基本信息"
                bordered style={{ marginBottom: 20, marginTop: 20 }}>
                <Descriptions.Item label="机构名称" span={3}>{orgInfo.name}</Descriptions.Item>
                <Descriptions.Item label="联系电话" span={3}>{orgInfo.telephone}</Descriptions.Item>
                <Descriptions.Item label="地址" span={3}> {orgInfo.address}{orgInfo.address_ext}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="校区信息"
                style={{ marginBottom: 20, marginTop: 20 }}>
                <div name="subOrgs">
                    <SubOrgInfoTable mode="form" value={orgInfo.sub_orgs} editable={false} />
                </div>
            </Descriptions>

            <Row gutter={[16, 16]}>
                <Col offset={22} span={1}>
                    <Button offset={16} onClick={() => { history.goBack() }} htmlType="button">
                        返回
            </Button>
                </Col>
            </Row>

        </div>
    );
}

export default OrgInfo;
