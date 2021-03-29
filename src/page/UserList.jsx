import React, { useState, useEffect } from 'react';
import { Breadcrumb, Modal, Space, Table, Image, Pagination, Row, Col, Card, Avatar, message } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import UserFilter from '../component/UserFilter';
import UserDetails from '../component/UserDetailsModel';
import { listUsersAPI, resetUserPasswordAPI, website } from '../api/api';
import { showTotal } from '../utils/page';

const { confirm } = Modal;
const { Meta } = Card;
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
  let [viewModelInfo, setViewModelInfo] = useState({
    visible: false,
    user: {},
  })

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
      message.error("获取用户列表失败，" + res.err_msg);
      return
    }
  }

  const closeViewModel = () => {
    setViewModelInfo({
      visible: false,
      user: {
        name: "",
        role_name: "",
        org_name: ""
      }
    });
  }
  const openViewModel = (user) => {
    setViewModelInfo({ visible: true, user: user });
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
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
        <Breadcrumb.Item>用户列表</Breadcrumb.Item>
      </Breadcrumb>
      <UserFilter onChangeFilter={handleChangeFilter} />
      {/* <Row>
        <Col span={24}>
          <Table
            pagination={false}
            style={{ marginTop: "30px" }}
            columns={columns}
            dataSource={users.data}
          />
        </Col>
      </Row> */}
      <Space style={{ marginTop: 30, marginLeft: 20 }} size={[28, 20]} wrap>
        {users.data == null ? "" : users.data.map((v) =>
          <Card
            style={{ width: 200 }}
            cover={
              <Image
                width={200}
                height={200}
                src={website + "/data/avatar/" + v.avatar}
                fallback="data:image/png;base64,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"
              />
            }

            actions={[
              <SearchOutlined onClick={() => openViewModel(v)} key="view" />,
              <ReloadOutlined onClick={() => handleOnResetPassword(v.user_id)} key="reset_password" />,
            ]}
          >
            <Meta
              title={v.name}
              description={
                <div>{v.org_name + "\b" + v.role_name}
                </div>
              }
            />
          </Card>
        )}

      </Space>

      <Row>
        <Col span={12}>
          <Pagination
            showSizeChanger={false}
            onChange={handleChangePage}
            style={{ textAlign: "right", marginTop: 10 }}
            defaultPageSize={pageSize}
            size="small"
            showTotal={showTotal}
            total={users.total} />
        </Col>
      </Row>

      <UserDetails
        visible={viewModelInfo.visible}
        closeModel={closeViewModel}
        user={viewModelInfo.user}
      />
    </div>
  );
}

export default UserList;
