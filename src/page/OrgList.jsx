import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table, Pagination } from 'antd';
import { useHistory } from "react-router-dom";
import RevokeOrgModel from '../component/RevokeOrgModel';
import OrgFilter from '../component/OrgFilter';
import { listOrgsAPI, getOrgAPI } from '../api/api';
import { getOrgStatus } from '../utils/status';
import { checkAuthorities } from '../utils/auth';

const pageSize = 10;
let pageIndex = 1;
let keywords = "";
function OrgList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {getOrgStatus(status)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { history.push("/main/org_details/" + record.id) }}>详情</a>
          {
            checkAuthorities(["机构审核"]) && record.id > 1 ? <a onClick={() => { handleRevoke(record.id) }}>吊销</a> : <span></span>
          }
          {
            checkAuthorities(["机构管理"]) && record.id > 1 ? <a onClick={() => { history.push("/main/org_update/" + record.id) }}>修改</a> : <span></span>
          }

        </Space>
      ),
    },
  ];
  let history = useHistory();
  let [revokeOrgModelVisible, setRevokeOrgModelVisible] = useState(false);
  let [orgData, setOrgData] = useState({});
  let [orgList, setOrgList] = useState([]);
  let [orgCount, setOrgCount] = useState(0);

  const handleRevoke = async (id) => {
    let res = await getOrgAPI(id);
    if (res.err_msg == "success") {
      let org = res.org;
      setOrgData(org);
      setRevokeOrgModelVisible(true);
    } else {
      message.warning("获取机构信息失败：" + res.err_msg);
      return;
    }
  }

  const fetchData = async (page, data) => {
    let res = await listOrgsAPI(page, pageSize, data);
    if (res.err_msg == "success") {
      let tempOrgs = [];
      for (let i = 0; i < res.data.orgs.length; i++) {
        let tmp = res.data.orgs[i];
        tempOrgs.push({
          id: tmp.id,
          key: tmp.id,
          name: tmp.name,
          subjects: tmp.subjects,
          status: tmp.status,
          telephone: tmp.telephone,
        });
      }
      setOrgList(tempOrgs);
      setOrgCount(res.data.total);

    } else {
      message.warning("获取机构列表失败：" + res.err_msg);
      return;
    }
  }
  useEffect(() => {
    fetchData(pageIndex);
  }, []);

  let handleChangePage = page => {
    pageIndex = page;
    fetchData(pageIndex);
  }
  let handleChangeQuery = query => {
    pageIndex = 1;
    keywords = query;
    fetchData(pageIndex, { query: keywords });
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>机构列表</Breadcrumb.Item>
      </Breadcrumb>
      <OrgFilter onChangeFilter={handleChangeQuery} />
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={orgList}
      />
      <Pagination showSizeChanger={false} onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={orgCount} />
      <RevokeOrgModel refreshData={() => fetchData(pageIndex)} orgData={orgData} visible={revokeOrgModelVisible} closeModel={() => { setRevokeOrgModelVisible(false) }} />
    </div>
  );
}

export default OrgList;
