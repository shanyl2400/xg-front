import React, { useState } from 'react';
import { Modal, InputNumber, Descriptions, message } from 'antd';
import { updatePaymentAmountAPI } from '../api/api'
import { getPaymentStatusTags } from '../utils/status';
import { formatDate } from '../utils/date';

const layout = {
    labelCol: { offset: 2, span: 4 },
    wrapperCol: { span: 10 },
};
function UpdatePriceModel(props) {
    const [amount, setAmount] = useState(1000);
    let handleOk = async () => {
        let res = await updatePaymentAmountAPI(props.record.id, { amount: amount });
        if (res.err_msg == "success") {
            message.success("改价成功");
            props.closeModel();
            props.refreshData();
        } else {
            message.error("改价失败:" + res.err_msg);
            props.closeModel();
        }
    };

    let handleCancel = () => {
        props.closeModel();
    };
    return (
        <Modal
            title="修改价格"
            visible={props.visible}
            onOk={handleOk}
            onCancel={props.closeModel}
        >
            <Descriptions title="缴费信息" bordered style={{ marginBottom: 20, marginTop: 20 }}>
                <Descriptions.Item label="费用" span={3}>{props.record.title}</Descriptions.Item>
                <Descriptions.Item label="金额" span={3}>
                    <span style={props.record.mode == 1 ? { "color": "#52c41a" } : { "color": "#f5222d" }}>
                        {props.record.mode == 1 ? "+" : "-"}{props.record.amount}
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="时间" span={3}>{formatDate(new Date(Date.parse(props.record.created_at)))}</Descriptions.Item>
                <Descriptions.Item label="状态" span={3}>{getPaymentStatusTags(props.record.status)}</Descriptions.Item>
                <Descriptions.Item label="修改费用">
                    <InputNumber
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\￥\s?|(,*)/g, '')}
                        placeholder="请填写"
                        value={amount}
                        onChange={e => setAmount(e)}
                    />
                </Descriptions.Item>
            </Descriptions>

        </Modal>
    );
}

export default UpdatePriceModel;
