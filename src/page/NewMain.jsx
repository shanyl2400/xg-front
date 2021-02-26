import React, { useState } from 'react';
import { BrowserRouter as Router, useHistory } from "react-router-dom";

import { Layout } from 'antd';
import SideMenu from './SideMenu';
import XgRouter from './Router';
import MyHeader from '../component/MyHeader';

import "./Main.css";

const { Content, Sider, Header } = Layout;

function Main() {
    let history = useHistory();
    let token = sessionStorage.getItem("token");
    if (token == null) {
        history.push("/");
    }

    const [collapsed, setCollepsed] = useState(false);
    const [theme, setTheme] = useState("light");

    const onCollapse = collapsed => {
        setCollepsed(collapsed);
    };
    const onChangeTheme = theme => {
        setTheme(theme);
    }
    return (
        <Router>
            <Layout>
                <Sider
                    trigger={null}
                    theme={theme}
                    collapsed={collapsed}
                    onCollapse={onCollapse}
                    collapsible>
                    <SideMenu theme={theme} collapsed={collapsed}></SideMenu>
                </Sider>
                <Layout style={{ padding: 10, paddingTop: 5, backgroundColor: "#f0f2f5" }}>
                    <Header style={{ padding: 0, height: 40, lineHeight: 3, marginBottom: 10, backgroundColor: "#fff" }} >
                        <MyHeader collapsed={collapsed} theme={theme} handleCollapse={onCollapse} handleTheme={onChangeTheme} />
                    </Header>
                    <Content style={{ padding: '0px 0px', textAlign: "left", backgroundColor: "#fff" }}>
                        <XgRouter />
                    </Content>
                </Layout>

            </Layout>
        </Router >
    );
}

export default Main;
