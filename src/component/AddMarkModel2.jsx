import React, { useState } from 'react';
import { Modal, Row, Col, Button, Tabs, Radio, Form, Input, InputNumber, message } from 'antd';
import { addOrderMarkAPI, updateOrderStatusAPI, payOrderAPI } from '../api/api';
import TextArea from 'antd/lib/input/TextArea';

const { TabPane } = Tabs;
const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};

let hideStatus = false;
let hidePayment = false;
let statusSelectDisable = [false, false, false, false, false];

const considerStatusOption = 0;
const invalidStatusOption = 1;
const depositStatusOption = 2;
const signupStatusOption = 3;
const revokeStatusOption = 4;

function AddMarkModel(props) {

    let [textContent, setTextContent] = useState("");
    let [statusContent, setStatusContent] = useState("");
    let [paymentContent, setPaymentContent] = useState("");
    let [paymentTitle, setPaymentTitle] = useState("");
    let [paymentDirector, setPaymentDirector] = useState(1);

    let [paymentAmount, setPaymentAmount] = useState("");
    let [statusAmount, setStatusAmount] = useState("");

    const [submitPayLoading, setSubmitPayLoading] = useState(false);
    const [submitStatusLoading, setSubmitStatusLoading] = useState(false);
    const [submitRemarkLoading, setSubmitRemarkLoading] = useState(false);

    const [textForm] = Form.useForm();
    const [statusForm] = Form.useForm();
    const [paymentForm] = Form.useForm();



    let [statusMode, setStatusMode] = useState(0);
    let [disableStatusPayment, setDisableStatusPayment] = useState(true);

    let [currentTab, setCurrentTab] = useState("1");
    let onCancel = () => {
        props.closeModel();
    }
    let onSubmitTextRemark = async () => {
        setSubmitRemarkLoading(true);
        let res = await addOrderMarkAPI(props.id, textContent)
        if (res.err_msg == "success") {
            message.success("添加回访成功");
            props.closeModel();
            props.refreshData();
            setTextContent("");
        } else {
            message.error("添加回访失败，" + res.err_msg);
        }
        setSubmitRemarkLoading(false);
    }

    let onSubmitStatusRemark = async () => {
        setSubmitStatusLoading(true);
        let res = await updateOrderStatusAPI({
            order_id: props.id,
            status: statusMode,
            amount: statusAmount,
            content: statusContent,
        })
        if (res.err_msg == "success") {
            message.success("修改订单状态成功");
            props.closeModel();
            props.refreshData();
            setCurrentTab("1");


            setStatusMode(0);
            setStatusAmount(0);
            setStatusContent("");

        } else {
            message.error("修改订单状态成功，" + res.err_msg);
        }
        setSubmitStatusLoading(false);
    }

    let onSubmitPaymentRemark = async () => {
        setSubmitPayLoading(true);
        let res = await payOrderAPI(props.id, {
            title: paymentTitle,
            mode: paymentDirector,
            amount: paymentAmount,
            content: paymentContent,
        });
        if (res.err_msg == "success") {
            message.success("收支创建成功");
            setCurrentTab("1");
            props.closeModel();
            props.refreshData();

            setPaymentTitle("");
            setPaymentDirector(1);
            setPaymentAmount(0);
            setPaymentContent("");
        } else {
            message.error("收支创建失败" + res.err_msg);
        }

        setSubmitPayLoading(false);
    }

    let changeTextContent = e => {
        setTextContent(e.target.value);
    }
    let changeStatusContent = e => {
        setStatusContent(e.target.value);
    }
    let changePaymentContent = e => {
        setPaymentContent(e.target.value);
    }
    let changePaymentTitle = e => {
        setPaymentTitle(e.target.value);
    }
    let changePaymentDirector = e => {

        setPaymentDirector(e.target.value);
    }

    let changePaymentAmount = e => {
        let x = Number(e.target.value);
        if (!isNaN(x)) {
            setPaymentAmount(x);
        }
    }

    let changeStatusAmount = e => {
        let x = Number(e.target.value);
        if (!isNaN(x)) {
            setStatusAmount(x);
        }
    }
    let changeTab = e => {
        setCurrentTab(e)
    }

    let changeStatusMode = e => {
        let option = e.target.value;
        switch (option) {
            case 2:
                setDisableStatusPayment(false);
                break;
            case 3:
                setDisableStatusPayment(true);
                setStatusAmount(0);
                break;
            case 4:
                setDisableStatusPayment(true);
                setStatusAmount(0);
                break;
            case 5:
                setDisableStatusPayment(false);
                break;
            case 6:
                setDisableStatusPayment(true);
                setStatusAmount(0);
                break;
        }
        setStatusMode(option);
    }

    let updateShowStatus = () => {
        // OrderStatusCreated  = 1
        // OrderStatusSigned   = 2
        // OrderStatusRevoked  = 3
        // OrderStatusInvalid  = 4
        // OrderStatusDeposit  = 5
        // OrderStatusConsider = 6
        hideStatus = false;
        hidePayment = false;

        if (sessionStorage.getItem("org_id") == 1) {
            hideStatus = true;
            hidePayment = true;
        }

        if (props.orderStatus == 4 || props.orderStatus == 3) {
            hideStatus = true;
        }

        //设置状态选择
        statusSelectDisable = [false, false, false, false, false];
        switch (props.orderStatus) {
            case 1:
                break;
            case 2:
                statusSelectDisable[considerStatusOption] = true;
                statusSelectDisable[depositStatusOption] = true;
                statusSelectDisable[invalidStatusOption] = true;
                statusSelectDisable[signupStatusOption] = true;
                // setStatusSelectDisable(tmp);
                break;
            case 3:
                statusSelectDisable[considerStatusOption] = true;
                statusSelectDisable[depositStatusOption] = true;
                statusSelectDisable[invalidStatusOption] = true;
                statusSelectDisable[signupStatusOption] = true;
                statusSelectDisable[revokeStatusOption] = true;
                // setStatusSelectDisable(tmp);
                break;
            case 4:
                statusSelectDisable[considerStatusOption] = true;
                statusSelectDisable[depositStatusOption] = true;
                statusSelectDisable[invalidStatusOption] = true;
                statusSelectDisable[signupStatusOption] = true;
                statusSelectDisable[revokeStatusOption] = true;
                // setStatusSelectDisable(tmp);
                break;
            case 5:
                statusSelectDisable[considerStatusOption] = true;
                statusSelectDisable[depositStatusOption] = true;
                statusSelectDisable[invalidStatusOption] = true;
                // setStatusSelectDisable(tmp);
                break;
            case 6:
                statusSelectDisable[considerStatusOption] = true;
                // setStatusSelectDisable(tmp);
                break;
            default:
                statusSelectDisable = [false, false, false, false, false];
        }
    }

    updateShowStatus();


    return (
        <Modal
            title="回访订单"
            visible={props.visible}
            onCancel={() => props.closeModel()}
            footer={null}
        >
            <Tabs defaultActiveKey="1" activeKey={currentTab} onChange={changeTab} style={{ marginTop: -20 }}>
                <TabPane tab="文本" key="1">
                    <Form form={textForm}>
                        <Form.Item label="内容" required={true}>
                            <TextArea
                                value={textContent}
                                onChange={changeTextContent}
                                placeholder="请填写回访信息"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                    </Form>

                    <Row style={{ marginTop: 10 }} justify="end">
                        <Col>
                            <Button onClick={onCancel}>取消</Button>
                        </Col>
                        <Col offset={1}>
                            <Button onClick={onSubmitTextRemark} type="primary" loading={submitRemarkLoading}>发布</Button>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="状态" key="2" disabled={hideStatus}>
                    <Form>
                        <Form.Item label="状态">
                            <Radio.Group value={statusMode} onChange={changeStatusMode} size="small">
                                <Radio.Button value={6} disabled={statusSelectDisable[0]}>考虑中</Radio.Button>
                                <Radio.Button value={4} disabled={statusSelectDisable[1]}>无效</Radio.Button>
                                <Radio.Button value={5} disabled={statusSelectDisable[2]}>交定金</Radio.Button>
                                <Radio.Button value={2} disabled={statusSelectDisable[3]}>报名</Radio.Button>
                                <Radio.Button value={3} disabled={statusSelectDisable[4]}>退学</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="备注">
                            <TextArea
                                value={statusContent}
                                onChange={changeStatusContent}
                                placeholder="请填写回访信息"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>
                        <Form.Item label="金额">
                            <Input
                                prefix="￥"
                                value={statusAmount}
                                placeholder="请填写"
                                disabled={disableStatusPayment}
                                onChange={changeStatusAmount} />
                        </Form.Item>
                    </Form>
                    <Row style={{ marginTop: 10 }} justify="end">
                        <Col>
                            <Button onClick={onCancel}>取消</Button>
                        </Col>
                        <Col offset={1}>
                            <Button onClick={onSubmitStatusRemark} type="primary" loading={submitStatusLoading}>发布</Button>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="收支" key="3" disabled={hidePayment}>
                    <Form>
                        <Form.Item label="收支">
                            <Radio.Group
                                value={paymentDirector}
                                onChange={changePaymentDirector}
                                size="small">
                                <Radio.Button value={1}>收入</Radio.Button>
                                <Radio.Button value={2}>支出</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="备注">
                            <TextArea
                                value={paymentContent}
                                onChange={changePaymentContent}
                                placeholder="请填写回访信息"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                        </Form.Item>

                        <Form.Item label="名目">
                            <Input
                                placeholder="请填写收支名目"
                                value={paymentTitle}
                                onChange={changePaymentTitle} />
                        </Form.Item>

                        <Form.Item label="金额">
                            <Input
                                prefix="￥"
                                value={paymentAmount}
                                placeholder="请填写"
                                onChange={changePaymentAmount} />
                        </Form.Item>


                    </Form>

                    <Row style={{ marginTop: 10 }} justify="end">
                        <Col>
                            <Button onClick={onCancel}>取消</Button>
                        </Col>
                        <Col offset={1}>
                            <Button onClick={onSubmitPaymentRemark} type="primary" loading={submitPayLoading}>发布</Button>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>

        </Modal>
    );
}

export default AddMarkModel;
