import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table, Pagination, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import RevokeOrgModel from '../component/RevokeOrgModel';
import RenewOrgModel from '../component/RenewOrgModel';
import OrgFilter from '../component/OrgFilter';
import { listOrgsAPI, getOrgAPI } from '../api/api';
import { getOrgStatus } from '../utils/status';
import { checkAuthorities } from '../utils/auth';
import { hideTelephone } from "../utils/telephone";
import { showTotal } from '../utils/page';

const pageSize = 10;
let pageIndex = 1;
function OrgList(props) {

  const menu = (record) => {
    return (
      <Menu>
        <Menu.Item key="1">
          {
            checkAuthorities(["机构管理"]) && record.id > 1 && record.status == 2 ? <a onClick={() => { history.push("/main/org_update/" + record.id) }}>修改</a> : <span></span>
          }
        </Menu.Item>

        <Menu.Item key="2">
          {
            checkAuthorities(["机构管理"]) && record.id > 1 && record.status == 2 ? <a onClick={() => { handleRenew(record.id) }}>延期</a> : <span></span>
          }
        </Menu.Item>
        <Menu.Item key="3">
          {
            checkAuthorities(["机构审核"]) && record.id > 1 && record.status == 2 ? <a onClick={() => { handleRevoke(record.id) }}>吊销</a> : <span></span>
          }
        </Menu.Item>
      </Menu>
    );
  }


  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (
        <span>{index + 1 + (pageIndex - 1) * pageSize}</span>
      )
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
      render: telephone => (
        <span>
          {hideTelephone(telephone)}
        </span>)
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
            checkAuthorities(["机构管理", "机构审核"]) && record.id > 1 && record.status == 2 ? (<Dropdown overlay={menu(record)} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                操作 <DownOutlined />
              </a>
            </Dropdown>) : ""
          }


        </Space>
      ),
    },
  ];
  let history = useHistory();
  let [revokeOrgModelVisible, setRevokeOrgModelVisible] = useState(false);
  let [renewOrgModelVisible, setRenewOrgModelVisible] = useState(false);
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

  const handleRenew = async (id) => {
    let res = await getOrgAPI(id);
    if (res.err_msg == "success") {
      let org = res.org;
      setOrgData(org);
      setRenewOrgModelVisible(true);
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
    fetchData(pageIndex, query);
  }

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>机构列表</Breadcrumb.Item>
      </Breadcrumb>
      <OrgFilter onChangeFilter={handleChangeQuery} />
      <Table
        pagination={false}
        style={{ marginTop: 0 }}
        columns={columns}
        dataSource={orgList}
      />
      <Pagination
        showSizeChanger={false}
        onChange={handleChangePage}
        style={{ textAlign: "right", marginTop: 10 }}
        defaultPageSize={pageSize}
        size="small"
        showTotal={showTotal}
        total={orgCount} />
      <RevokeOrgModel refreshData={() => fetchData(pageIndex)} orgData={orgData} visible={revokeOrgModelVisible} closeModel={() => { setRevokeOrgModelVisible(false) }} />
      <RenewOrgModel refreshData={() => fetchData(pageIndex)} orgData={orgData} visible={renewOrgModelVisible} closeModel={() => { setRenewOrgModelVisible(false) }} />
    </div>
  );
}

export default OrgList;
