import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, Breadcrumb, Row, Col, Typography, Descriptions, message } from 'antd';
import { getOrgAPI } from '../api/api';
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import OrgCertificationView from '../component/OrgCertificationView';
import { parseAddress } from "../utils/address";
import { formatDate } from '../utils/date';
import { getOrgStatus } from '../utils/status';
const { Title } = Typography;
function OrgDetails(props) {
  let { id } = useParams();
  let history = useHistory();

  let [orgData, setOrgData] = useState({});
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

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>机构详情</Breadcrumb.Item>
      </Breadcrumb>

      <Descriptions title="基本信息"
        bordered style={{ marginBottom: 20, marginTop: 20 }}>
        <Descriptions.Item label="机构名称" span={2}>{orgData.name}</Descriptions.Item>
        <Descriptions.Item label="联系电话" span={2}>{orgData.telephone}</Descriptions.Item>
        <Descriptions.Item label="地址" span={3}>{parseAddress(orgData.address)}</Descriptions.Item>
        <Descriptions.Item label="状态" span={3}>{getOrgStatus(orgData.status)}</Descriptions.Item>
        <Descriptions.Item label="过期时间" span={3}>{orgData.expired_at == null ? "无限期" : formatDate(new Date(Date.parse(orgData.expired_at)))}</Descriptions.Item>
        <Descriptions.Item label="结算说明" span={3}> {orgData.settlement_instruction == "" ? "默认方案" : orgData.settlement_instruction}</Descriptions.Item>
        <Descriptions.Item label="资质情况" span={2}>
          <OrgCertificationView
            businessLicense={orgData.business_license}
            entityIdentity={orgData.corporate_identity}
            schoolPermission={orgData.school_permission}
          />
        </Descriptions.Item>
      </Descriptions>


      { orgData.sub_orgs != undefined && orgData.subOrgs != null && <h3>分校区</h3>}

      {
        orgData.sub_orgs != undefined && <SubOrgInfoTable value={orgData.sub_orgs} />
      }

      <Row gutter={[16, 16]} style={{ marginTop: 5 }}>
        <Col offset={22} span={1}><Button onClick={() => history.goBack()}>返回</Button></Col>
      </Row>

    </div >
  );
}
export default OrgDetails;