import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Descriptions } from 'antd';
import { getOrgAPI } from '../api/api';
import { parseAddress } from "../utils/address";

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};
const tailLayout = {
    wrapperCol: { offset: 21, span: 16 },
};
function SubOrgDetailsModel(props) {
    const [orgInfo, setOrgInfo] = useState({})

    useEffect(() => {
        const fetchData = () => {
            if (props.data == null || props.data == undefined) {
                return;
            }
            for (let i = 0; i < props.data.length; i++) {
                if (props.data[i].id == props.id) {
                    setOrgInfo(props.data[i])
                }

            }
        }
        fetchData();
    }, [props.id, props.data])

    const onClose = e => {
        props.closeModel();
    }

    let address = "";
    if (orgInfo.address != null) {
        address = orgInfo.address.region.replace(/-/g, "");
        address = address + orgInfo.address.ext;
    }


    return (
        <Modal
            title="分校信息"
            visible={props.visible}
            footer={null}
            onCancel={onClose}
        >   <div style={{ padding: 0, height: "100%", width: "100%" }}>
                {/* <div>校区名: {orgInfo.name}</div>
                <div>地址: {parseAddress(address)}</div>
                <div>支持课程: {orgInfo.intentSubject != null && orgInfo.intentSubject.map((v) => <span>{v},</span>
                )}</div> */}

                <Descriptions bordered >
                    <Descriptions.Item label="校区名" span={3}>{orgInfo.name}</Descriptions.Item>
                    <Descriptions.Item label="地址" span={3}>{parseAddress(address)}</Descriptions.Item>
                    <Descriptions.Item label="支持课程" span={3}>{orgInfo.intentSubject != null && orgInfo.intentSubject.map((v) => <div>{v}</div>
                    )}</Descriptions.Item>
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

export default SubOrgDetailsModel;
