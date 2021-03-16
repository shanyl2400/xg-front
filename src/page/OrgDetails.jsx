import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, Breadcrumb, Row, Col, Typography, Descriptions, message } from 'antd';
import { getOrgAPI } from '../api/api';
import SubOrgInfoTable from '../component/SubOrgInfoTable';
import { parseAddress } from "../utils/address";
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
  const getStatusName = (status) => {
    switch (status) {
      case 1:
        return "未审核";
      case 2:
        return "已认证";
      case 3:
        return "已吊销";
      default:
        return "未知";
    }
  }
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
        <Descriptions.Item label="状态" span={3}>{getStatusName(orgData.status)}</Descriptions.Item>
      </Descriptions>

      {/* <Card style={{ width: "100%", margin: "20px 5px" }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>机构名称：{orgData.name}</Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>地址：{parseAddress(orgData.address)}</Col>
        </Row>
        <Row gutter={[16, 16]} key={1}>
          <Col span={12}>状态：{getStatusName(orgData.status)}</Col>
        </Row>
      </Card> */}

      { orgData.sub_orgs != undefined && orgData.subOrgs != null && <h3>分校区</h3>}

      {
        orgData.sub_orgs != undefined && <SubOrgInfoTable value={orgData.sub_orgs} />
      }

      <Row gutter={[16, 16]}>
        <Col offset={22} span={1}><Button onClick={() => history.goBack()}>返回</Button></Col>
      </Row>

    </div >
  );
}
export default OrgDetails;