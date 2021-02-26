import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, SkinOutlined } from '@ant-design/icons';
import { Row, Col, Space, Avatar } from 'antd';
import UserButton from './UserButton';
import { website } from '../api/api';

function MyHeader(props) {

    const clickMenu = e => {
        props.handleCollapse(!props.collapsed);
    }
    const clickSkin = e => {
        if (props.theme == "light") {
            props.handleTheme("dark");
        } else {
            props.handleTheme("light");
        }
    }
    return (
        <Row justify="end">
            <Space size={15}>
                <Col>
                    {/* <MenuFoldOutlined /> */}
                    <div style={{ marginTop: 4 }}>
                        {props.collapsed ?
                            <MenuUnfoldOutlined onClick={clickMenu} style={{ fontSize: 20, cursor: "pointer" }} /> :
                            <MenuFoldOutlined onClick={clickMenu} style={{ fontSize: 20, cursor: "pointer" }} />
                        }
                    </div>
                </Col>
                <Col>
                    <div style={{ marginTop: 4 }}>
                        <SkinOutlined onClick={clickSkin} style={{ fontSize: 20, cursor: "pointer" }} />
                    </div>
                </Col>
                <Col style={{ marginRight: 20 }}>
                    <UserButton />
                </Col>
            </Space>


        </Row>
    )
}
export default MyHeader;