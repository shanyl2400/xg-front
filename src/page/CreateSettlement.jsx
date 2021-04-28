import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Breadcrumb, InputNumber, Radio, DatePicker, Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { baseURL, website, createSettlementAPI } from '../api/api';

const { RangePicker } = DatePicker;
const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
};
const tailLayout = {
    wrapperCol: { offset: 12, span: 16 },
};
const { TextArea } = Input;

function CreateSettlement(props) {
    const [form] = Form.useForm();
    useEffect(() => {
        const fetchData = async () => {
        }
        fetchData();
    }, [])
    const [invoiceList, setInvoiceList] = useState();
    const [previewInfo, setPreviewInfo] = useState({
        previewVisible: false,
        previewTitle: "",
        previewImage: "",
    });
    const [status, setStatus] = useState(1);

    const checkPaymentNO = no => {
        if (no == null) {
            return "";
        }
        if (no.startsWith("PM")) {
            return no.slice(2);
        }
        message.warn("收支编号输入错误，应以PM开头");
        return null;
    }
    const create = () => {
        form.validateFields().then(async e => {
            let timeRange = getTimeRange();
            let success_orders = form.getFieldValue("success_orders");
            let failed_orders = form.getFieldValue("failed_orders");
            let amount = form.getFieldValue("amount");
            let commission = form.getFieldValue("commission");
            let note = form.getFieldValue("note");

            let success_orders_req = [];
            let failed_orders_req = [];
            if (success_orders != undefined && success_orders != "") {
                let temp = success_orders.split(";");
                for (let i = 0; i < temp.length; i++) {
                    let no = checkPaymentNO(temp[i]);
                    if (no == null) {
                        return;
                    }
                    if (no != "") {
                        let x = parseInt(no)
                        success_orders_req.push(x);
                    }
                }
            }
            if (failed_orders != undefined && failed_orders != "") {
                let temp = failed_orders.split(";");
                for (let i = 0; i < temp.length; i++) {
                    let no = checkPaymentNO(temp[i]);
                    if (no == null) {
                        return;
                    }
                    if (no != "") {
                        let x = parseInt(no)
                        failed_orders_req.push(x);
                    }
                }
            }
            let commissionNum = Number(commission);
            if (isNaN(commissionNum)) {
                message.warn("佣金必须是数字");
                return;
            }
            let amountNum = Number(amount);
            if (isNaN(amountNum)) {
                message.warn("销售额必须是数字");
                return;
            }

            let data = {
                start_at: timeRange.startAt,
                end_at: timeRange.endAt,
                success_orders: success_orders_req,
                failed_orders: failed_orders_req,
                amount: amountNum,
                commission: commissionNum,
                status: status == 0 ? 1 : status,
                note: note,
                invoice: invoiceList ? invoiceList.source : null
            }
            console.log(data);
            let res = await createSettlementAPI(data);
            if (res.err_msg == "success") {
                //status 1 创建成功
                message.success('创建成功');
                setInvoiceList(null);
                setStatus(0);
                form.resetFields();
            } else {
                console.log(res);
                //创建失败
                message.error('创建失败:' + res.err_msg);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    const getTimeRange = () => {
        let val = form.getFieldValue("duration");
        if (val.length != 2) {
            return;
        }
        for (let i = 0; i < val.length; i++) {
            if (val[i] == null) {
                return;
            }
        }
        let startAt = val[0].unix();
        let endAt = val[1].unix();
        return {
            startAt: startAt,
            endAt: endAt
        }
    }

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
    const handleCancel = () => setPreviewInfo({ previewVisible: false, previewImage: "" });
    const handlePreview = async file => {
        file.url = website + "/data/org_attach/" + file.source;
        setPreviewInfo({
            previewImage: file.url,
            previewVisible: true,
            previewTitle: file.name,
        });
    }
    const handleChangeBusinessLicense = ({ fileList }) => {
        if (fileList.length == 0) {
            setInvoiceList(null);
            return;
        }
        if (fileList[0].response) {
            fileList[0].source = fileList[0].response.name
        }
        setInvoiceList(fileList[0]);
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>结算管理</Breadcrumb.Item>
                <Breadcrumb.Item>创建结算</Breadcrumb.Item>
            </Breadcrumb>
            <Form {...layout}
                form={form}
                style={{ marginTop: "30px", marginLeft: "-40px" }}
            >
                <Form.Item name="duration" label="结算周期" rules={[{ required: true }]} >
                    <RangePicker />
                </Form.Item>
                <Form.Item name="success_orders" label="成交订单" rules={[{ required: false }]}>
                    <TextArea
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        placeholder="请填写收支编号分号；隔开"
                    />
                </Form.Item>

                <Form.Item name="failed_orders" label="退费订单" rules={[{ required: false }]} >
                    <TextArea
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        placeholder="请填写收支编号分号；隔开"
                    />
                </Form.Item>

                <Form.Item name="amount" label="销售额" rules={[{ required: true }]} >
                    <Input
                        prefix="￥"
                        placeholder="请填写" />
                </Form.Item>

                <Form.Item name="commission" label="佣金金额" rules={[{ required: true }]}>
                    <Input
                        prefix="￥"
                        placeholder="请填写" />
                </Form.Item>

                <Form.Item name="status" label="是否结算" >
                    <Radio.Group defaultValue={1} value={status} onChange={(e) => { setStatus(e.target.value) }}>
                        <Radio.Button value={1}>否</Radio.Button>
                        <Radio.Button value={2}>是</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="invoice" label="发票" >
                    <Upload
                        name="file"
                        listType="picture-card"
                        fileList={invoiceList == null ? [] : [invoiceList]}
                        className="avatar-uploader"
                        headers={{ Authorization: sessionStorage.getItem("token") }}
                        action={baseURL + "/upload/org_attach"}
                        beforeUpload={beforeUpload}
                        onPreview={handlePreview}
                        onChange={handleChangeBusinessLicense}
                    >
                        {invoiceList != null ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button onClick={() => create()} htmlType="button" type="primary">
                        保存
                    </Button>

                </Form.Item>
            </Form>
            <Modal
                visible={previewInfo.previewVisible}
                title={previewInfo.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewInfo.previewImage} />
            </Modal>
        </div>
    );
}

export default CreateSettlement;
