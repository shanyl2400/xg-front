import React, { useState } from 'react';
import { BrowserRouter as Router, useHistory } from "react-router-dom";

import { Layout } from 'antd';
import SideMenu from './SideMenu';
import XgRouter from './Router';

import "./Main.css";

const { Content, Sider, Header } = Layout;

function Main() {
    let history = useHistory();
    let token = sessionStorage.getItem("token");
    if (token == null) {
        history.push("/");
    }

    return (
        <Router>
            <Layout
                style={{ height: '100%' }}>
                <Sider>
                    <SideMenu></SideMenu>
                </Sider>
                <Content style={{ padding: '10px 80px', textAlign: "left", backgroundColor: "#ffffff" }}>
                    <XgRouter />
                </Content>
            </Layout>
        </Router>
    );
}

export default Main;
