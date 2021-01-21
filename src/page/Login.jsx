import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Layout, Input, Button, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginAPI } from '../api/api';
import logo from '../logo.png';
import axios from "axios"; //导入axios
import './Login.css'
const { Header, Footer, Content } = Layout;

function saveSideInfo(name, res) {
    sessionStorage.setItem("user_name", name);
    sessionStorage.setItem("role_id", res.data.role_id);
    sessionStorage.setItem("org_id", res.data.org_id);
    console.log(res.data.auths)
    sessionStorage.setItem("role_name", res.data.role_name);
    sessionStorage.setItem("org_name", res.data.org_name);
    sessionStorage.setItem("avatar", res.data.avatar);
    let auths = ""
    for (let i = 0; i < res.data.auths.length; i++) {
        auths = auths + res.data.auths[i].name + ", ";
    }
    sessionStorage.setItem("auths", auths);
}



function Login(props) {
    let [userName, setUserName] = useState("");
    let [password, setPassword] = useState("");
    let [hasInvalidNamePassword, setHasInvalidNamePassword] = useState(false);

    let history = useHistory();
    const doLogin = (props) => {
        let roleId = sessionStorage.getItem("role_id");
        switch (roleId) {
            case "1":
                history.push("/main");
                break;
            case "2":
                history.push("/main/create_student");
                break;
            case "3":
                history.push("/main/dispatch_order");
                break;
            case "4":
                history.push("/main/user_list");
                break;
            case "5":
                history.push("/main/org_list");
                break;
            case "6":
                history.push("/main/review_order");
                break;
            case "7":
                history.push("/main/order_list/org");
                break;
            default:
                history.push("/main/user_info");
        }
    }

    let token = sessionStorage.getItem("token");
    if (token != null) {
        doLogin(props);
    }
    const handleClick = async e => {
        let userRes = await loginAPI(userName, password);
        if (userRes != "" && userRes != null) {
            sessionStorage.setItem("token", userRes.data.token);
            saveSideInfo(userName, userRes);
            axios.defaults.headers.common["Authorization"] = userRes.data.token;
            doLogin(props);
        } else {
            setHasInvalidNamePassword(true)
        }
    };
    const handleChangeUserName = e => {
        setUserName(e.target.value);
    }
    const handleChangePassword = e => {
        setPassword(e.target.value);
    }

    const keyUp = (e) => {
        if (e.keyCode === 13) {
            handleClick();
        }
    }

    return (
        <Layout onKeyUp={keyUp} style={{ background: '#fff' }}>
            <Header style={{ background: '#fff' }}>
            </Header>
            <Content style={{ padding: '20px 50px' }}>

                <div className="site-layout-content">
                    <div className="site-login-item">
                        <img className="login-logo" src={logo} />
                    </div>
                    <div className="site-login-item" style={{ margin: '40px 0px 0px 0px' }}>
                        <Form.Item
                            validateStatus={hasInvalidNamePassword ? "error" : ""}
                            help={hasInvalidNamePassword ? "账号或密码错误" : ""}
                        >
                            <Input
                                id="userName"
                                value={userName}
                                className="site-login-item-input"
                                placeholder="请输入用户名"
                                prefix={<UserOutlined />}
                                onChange={e => handleChangeUserName(e)}
                            />
                        </Form.Item>

                    </div>
                    <div className="site-login-item">
                        <Form.Item
                            validateStatus={hasInvalidNamePassword ? "error" : ""}
                            help={hasInvalidNamePassword ? "账号或密码错误" : ""}
                        >
                            <Input.Password
                                value={password}
                                className="site-login-item-input"
                                placeholder="请输入密码"
                                prefix={<LockOutlined />}
                                onChange={e => handleChangePassword(e)}
                            />
                        </Form.Item>
                    </div>

                    <div className="site-login-item">
                        <Button onClick={(e) => handleClick(e)} type="primary">
                            登录
                    </Button>
                    </div>
                </div>
            </Content>
            <Footer style={{ background: '#fff' }}></Footer>
        </Layout>
    );

}

export default Login;