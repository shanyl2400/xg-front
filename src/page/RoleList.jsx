import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, message, Row, Col } from 'antd';
import { listRolesAPI } from '../api/api';

function RoleList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限',
      dataIndex: 'auth_list',
      key: 'auth_list',
      render: (auths, record) => (
        <div>
          {auths != null && auths.map((v) => <span>{v.name},&nbsp;</span>)}
        </div>
      )
    }
  ];

  let [roles, setRoles] = useState([])

  const fetchData = async e => {
    let res = await listRolesAPI();
    if (res.err_msg == "success") {
      setRoles(res.roles);
    } else {
      message.error("获取用户列表失败，", res.err_msg);
      return
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  console.log(roles);

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        <Breadcrumb.Item>角色列表</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col span={22}>
          <Table
            pagination={false}
            style={{ marginTop: "30px" }}
            columns={columns}
            dataSource={roles}
          />
        </Col>
      </Row>

      <Row>
        <Col span={14}>
        </Col>
      </Row>
    </div>
  );
}

export default RoleList;
