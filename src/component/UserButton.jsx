import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Avatar } from 'antd';
import { website } from '../api/api';
import { backgroundColor } from '../utils/bgcolor';

function UserButton(props) {
    const imageUrl = sessionStorage.getItem("avatar");
    const [background, setBackground] = useState(backgroundColor());
    let history = useHistory();
    const mouseEnter = e => {
        setBackground("#1890ff");
    }
    const mouseLeave = e => {
        setBackground(backgroundColor());
    }
    const clickButton = e => {
        history.push("/main/user_info");
    }
    let handleLogout = () => {
        sessionStorage.removeItem("token");
        window.location = "/";
        window.location.reload();
        // history.push("/web/login");
    }
    const menu = (
        <Menu style={{ marginTop: 30 }}>
            <Menu.Item key="0">
                <a onClick={clickButton}><UserOutlined />个人中心</a>
            </Menu.Item>
            <Menu.Item key="1">
                <a onClick={handleLogout}><LogoutOutlined />注销</a>
            </Menu.Item>
        </Menu>
    );
    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}>
            <div
                style={{ cursor: "pointer" }}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}>
                <div style={{ float: "right", marginTop: -6, paddingRight: 4, background: background }}>
                    {sessionStorage.getItem("user_name")}
                </div>
                <div style={{ float: "right", paddingRight: 8, paddingLeft: 4, marginTop: -6, background: background }}>
                    {imageUrl == "" ? <Avatar size={25} icon={<UserOutlined />} /> :
                        <Avatar size={24} src={website + "/data/avatar/" + imageUrl} />}
                </div>
            </div>
        </Dropdown>

    )
}
export default UserButton;