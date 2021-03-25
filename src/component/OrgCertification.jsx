import React, { useState, useEffect } from 'react';
import { Space, Card, Upload, Modal, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { baseURL, website } from '../api/api';
const { Text } = Typography;

export default function OrgCertification(props) {
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewTitle: "",
        previewImage: "",
    });

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('头像文件必须为JPG/PNG');
        }
        const isLt16M = file.size / 1024 / 1024 < 16;
        if (!isLt16M) {
            message.error('图片大小必须小于16MB');
        }
        return isJpgOrPng && isLt16M;
    }

    const handleChangeBusinessLicense = ({ fileList }) => {
        if (fileList.length == 0) {
            props.updateBusinessLicense(null);
            return;
        }
        if (fileList[0].response) {
            fileList[0].source = fileList[0].response.name
        }
        props.updateBusinessLicense(fileList[0]);
    }
    const handleChangeEntityIdentity = ({ fileList }) => {
        if (fileList.length == 0) {
            props.updateEntityIdentity(null);
            return;
        }
        if (fileList[0].response) {
            fileList[0].source = fileList[0].response.name
        }
        props.updateEntityIdentity(fileList[0]);
    }
    const handleChangeSchoolPermission = ({ fileList }) => {
        if (fileList.length == 0) {
            props.updateSchoolPermission(null);
            return;
        }
        if (fileList[0].response) {
            fileList[0].source = fileList[0].response.name
        }
        props.updateSchoolPermission(fileList[0]);
    }

    const handleCancel = () => setPreviewInfo({ previewVisible: false, previewImage: "" });
    const handlePreview = async file => {
        file.url = website + "/data/org_attach/" + file.source;
        setPreviewInfo({
            previewImage: file.url,
            previewVisible: true,
            previewTitle: file.name,
        });
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div>
            <Card>
                <Space size={20} wrap>
                    <div style={{ width: 100 }} >
                        <Upload
                            name="file"
                            listType="picture-card"
                            fileList={props.businessLicense == null ? [] : [props.businessLicense]}
                            className="avatar-uploader"
                            headers={{ Authorization: sessionStorage.getItem("token") }}
                            action={baseURL + "/upload/org_attach"}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={handleChangeBusinessLicense}
                        >
                            {props.businessLicense != null ? null : uploadButton}
                        </Upload>
                        <Text type="secondary">营业执照</Text>
                    </div>
                    <div style={{ width: 100 }} >
                        <Upload
                            name="file"
                            listType="picture-card"
                            fileList={props.entityIdentity == null ? [] : [props.entityIdentity]}
                            className="avatar-uploader"
                            headers={{ Authorization: sessionStorage.getItem("token") }}
                            action={baseURL + "/upload/org_attach"}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={handleChangeEntityIdentity}
                        >
                            {props.entityIdentity != null ? null : uploadButton}
                        </Upload>
                        <div style={{ marginLeft: 14 }}>
                            <Text type="secondary">法人身份证</Text>
                        </div>
                    </div>

                    <div style={{ width: 100 }} >
                        <Upload
                            name="file"
                            listType="picture-card"
                            fileList={props.schoolPermission == null ? [] : [props.schoolPermission]}
                            className="avatar-uploader"
                            headers={{ Authorization: sessionStorage.getItem("token") }}
                            action={baseURL + "/upload/org_attach"}
                            beforeUpload={beforeUpload}
                            onPreview={handlePreview}
                            onChange={handleChangeSchoolPermission}
                        >
                            {props.schoolPermission != null ? null : uploadButton}
                        </Upload>
                        <Text type="secondary">办学许可</Text>
                    </div>

                </Space>
            </Card>
            <Modal
                visible={previewInfo.previewVisible}
                title={previewInfo.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewInfo.previewImage} />
            </Modal>
        </div>

    )
}