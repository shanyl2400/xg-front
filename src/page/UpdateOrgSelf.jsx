import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, message } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { getOrgAPI, updateOrgSelfAPI, website } from '../api/api';
import SubOrgEditModelAddress from '../component/SubOrgEditModelAddress';
import OrgCertification from '../component/OrgCertification';
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

    let id = sessionStorage.getItem("org_id");
    const [certificationInfo, setCertificationInfo] = useState({
        businessLicense: null,
        entityIdentity: null,
        schoolPermission: null
    });
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
                handleCertificationURL(org);
            } else {
                message.warning("获取机构信息失败：" + res.err_msg);
                history.goBack();
                return;
            }
        }
        fetchData();
    }, []);
    const handleCertificationURL = org => {
        let businessLicense = buildURLFile(1, "business_license", org.business_license);
        let schoolPermission = buildURLFile(2, "school_permission", org.school_permission);
        let entityIdentity = buildURLFile(3, "corporate_identity", org.corporate_identity);
        setCertificationInfo({
            businessLicense: businessLicense,
            schoolPermission: schoolPermission,
            entityIdentity: entityIdentity,
        });
    }
    const buildURLFile = (id, name, source) => {
        if (source == "") {
            return null;
        }
        return {
            uid: id,
            name: name,
            status: 'done',
            source: source,
            url: website + "/data/org_attach/" + source,
        };
    }
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
            let request = {
                org: {
                    name: formData.name,
                    telephone: formData.telephone,
                    address: formData.addressData.region,
                    address_ext: formData.addressData.ext,
                },
                sub_orgs: subOrgInfos
            };
            request = buildCertification(request);
            let res = await updateOrgSelfAPI(request)
            if (res.err_msg == "success") {
                message.success("机构更新成功");
                history.goBack();
            } else {
                message.error("机构更新失败");
            }

        });
    }

    const buildCertification = req => {
        req.org.business_license = certificationInfo.businessLicense == null ? "" : certificationInfo.businessLicense.source;
        req.org.corporate_identity = certificationInfo.entityIdentity == null ? "" : certificationInfo.entityIdentity.source;
        req.org.school_permission = certificationInfo.schoolPermission == null ? "" : certificationInfo.schoolPermission.source;
        return req;
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
