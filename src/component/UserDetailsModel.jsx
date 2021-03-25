import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Descriptions } from 'antd';

const tailLayout = {
    wrapperCol: { offset: 21, span: 16 },
};
function UserDetails(props) {
    const onClose = e => {
        props.closeModel();
    }

    return (
        <Modal
            title="分校信息"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ padding: 0, height: "100%", width: "100%" }}>

                <Descriptions bordered >
                    <Descriptions.Item label="用户名" span={3}>{props.user.name}</Descriptions.Item>
                    <Descriptions.Item label="角色" span={3}>{props.user.role_name}</Descriptions.Item>
                    <Descriptions.Item label="所属机构" span={3}>{props.user.org_name}</Descriptions.Item>
                </Descriptions>

                <Form.Item {...tailLayout}>
                    <Button htmlType="button" style={{ marginTop: 10 }} onClick={onClose}>
                        返回
            </Button>
                </Form.Item>
            </div>

        </Modal >
    );
}

export default UserDetails;
