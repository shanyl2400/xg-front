import React, { useState } from 'react';
import { Breadcrumb, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UpdatePasswordModel from '../component/UpdatePasswordModel'

const { Title, Paragraph } = Typography;
function UserInfo() {
  const [updatePasswordVisible, setUpdatePasswordVisible] = useState(false)
  let handleUpdatePassword=()=>{
    setUpdatePasswordVisible(true);
  }
  let handleCancelUpdatePasswordModel=()=>{
    setUpdatePasswordVisible(false);
  }
  let handleLogout=()=>{
    sessionStorage.removeItem("token");
    window.location.reload();
  }
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>个人中心</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ margin: "20px 20px" }} >
        <Avatar style={{ marginTop: -110 }} shape="square" size={150} icon={<UserOutlined />} />
        <div style={{ display: "inline-block", marginLeft: 30, marginTop: 20 }}>
  <div style={{ marginTop: 10, fontSize: 24, fontWeight: "bold" }}>{sessionStorage.getItem("user_name")}</div>
          <div style={{ marginTop: 10 }}>{sessionStorage.getItem("role_name")}</div>
          <div style={{ marginTop: 10 }}><a onClick={handleUpdatePassword}>修改密码</a></div>
          <div style={{ marginTop: 10 }}><a onClick={handleLogout}>注销</a></div>
        </div>
      </div>
      <UpdatePasswordModel 
        visible={updatePasswordVisible}
        handleCancel={handleCancelUpdatePasswordModel}
      />
    </div>
  );
}

export default UserInfo;
