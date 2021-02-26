import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Row, Col, Space, Avatar } from 'antd';
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
    return (
        <div
            style={{ cursor: "pointer" }}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}
            onClick={clickButton}>
            <div style={{ float: "right", marginTop: -6, paddingRight: 4, background: background }}>
                {sessionStorage.getItem("user_name")}
            </div>
            <div style={{ float: "right", paddingRight: 8, paddingLeft: 4, marginTop: -6, background: background }}>
                {imageUrl == "" ? <Avatar size={25} icon={<UserOutlined />} /> :
                    <Avatar size={24} src={website + "/data/avatar/" + imageUrl} />}
            </div>

        </div>
    )
}
export default UserButton;