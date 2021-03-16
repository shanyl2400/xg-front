import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, Avatar, Typography, Upload, Button, message } from 'antd';
import { UserOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import UpdatePasswordModel from '../component/UpdatePasswordModel'
import { baseURL, website } from '../api/api';

const { Title, Paragraph } = Typography;
function UserInfo() {
  const [updatePasswordVisible, setUpdatePasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(sessionStorage.getItem("avatar"));

  let history = useHistory();
  let handleUpdatePassword = () => {
    setUpdatePasswordVisible(true);
  }
  let handleCancelUpdatePasswordModel = () => {
    setUpdatePasswordVisible(false);
  }
  let handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location = "/";
    window.location.reload();
    // history.push("/web/login");
  }
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('头像文件必须为JPG/PNG');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小必须小于2MB');
    }
    return isJpgOrPng && isLt2M;
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        if (info.file.response.err_msg == "success") {
          console.log(info.file.response.name);
          setImageUrl(info.file.response.name);
          sessionStorage.setItem("avatar", info.file.response.name)
        }

        // sessionStorage.getItem(imageUrl);
      },
      );
    }
  }
  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>个人中心</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ margin: "20px 20px" }} >


        <Upload
          name="file"
          className="avatar-uploader"
          showUploadList={false}
          headers={{ Authorization: sessionStorage.getItem("token") }}

          action={baseURL + "/upload/avatar"}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl == "" ? <Avatar style={{ marginTop: -110 }} size={150} icon={<UserOutlined />} /> :
            <Avatar style={{ marginTop: -110 }} size={150} src={website + "/data/avatar/" + imageUrl} />}

        </Upload>
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
    </div >
  );
}

export default UserInfo;
