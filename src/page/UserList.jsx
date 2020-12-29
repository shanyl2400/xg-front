import React, { useState, useEffect } from 'react';
import { Breadcrumb, Modal, Space, Table, Pagination, Row, Col, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import UserFilter from '../component/UserFilter'
import { listUsersAPI, resetUserPasswordAPI } from '../api/api';

const { confirm } = Modal;
const pageSize = 10;
let pageIndex = 1;
let data = {
  name: "",
  roleID: 0,
  orgID: 0,
}
function UserList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '机构',
      dataIndex: 'org_name',
      key: 'org_name',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { handleOnResetPassword(record.user_id) }}>重置密码</a>
        </Space>
      ),
    },
  ];

  let [users, setUsers] = useState({ total: 0, data: [] });

  let handleChangePage = (page) => {
    pageIndex = page;
    fetchData(pageIndex);
  }
  let handleOnResetPassword = (userId) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: '确认重置用户密码',
      async onOk() {
        let res = await resetUserPasswordAPI(userId);
        if (res.err_msg == "success") {
          message.success("用户密码已重置");
        } else {
          message.error("用户重置密码失败，" + res.err_msg);
        }
      },
      onCancel() {
      },
      content: (
        <>
          用户密码将被设置为123456，是否重置用户密码？
        </>
      ),
    });
  }

  const fetchData = async (e, data) => {
    let res = await listUsersAPI(e, pageSize, data);
    if (res.err_msg == "success") {
      setUsers({
        data: res.users,
        total: res.total,
      });
    } else {
      message.error("获取用户列表失败，", res.err_msg);
      return
    }
  }
  useEffect(() => {
    fetchData(pageIndex);
  }, []);

  const handleChangeFilter = v => {
    data.name = v.name;
    data.roleID = v.role;
    data.orgID = v.org;
    pageIndex = 1;
    console.log(v)
    fetchData(pageIndex, data);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        <Breadcrumb.Item>用户列表</Breadcrumb.Item>
      </Breadcrumb>
      <UserFilter onChangeFilter={handleChangeFilter} />
      <Row>
        <Col span={12}>
          <Table
            pagination={false}
            style={{ marginTop: "30px" }}
            columns={columns}
            dataSource={users.data}
          />
        </Col>
      </Row>

      <Row>
        <Col span={12}>
          <Pagination onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={users.total} />
        </Col>
      </Row>
    </div>
  );
}

export default UserList;
