import React, { useState, useEffect } from 'react';
import { Select, Input, Row, Space, Col, message } from 'antd';
import { listOrderSourcesAPI } from '../api/api';

const { Option } = Select;
async function getOrderSources() {
    let rawSources = await listOrderSourcesAPI();
    if (rawSources.err_msg != "success") {
        message.error("无法获取订单来源信息：" + rawSources.err_msg);
        return [];
    }
    return rawSources.sources;
}

function OrderSourceForm(props) {
    const [orderSources, setOrderSources] = useState([]);
    const [orderSourceID, setOrderSourceID] = useState();
    const [orderSourceExt, setOrderSourceExt] = useState();
    useEffect(() => {
        const fetchData = async () => {
            // const sub = await getSubjects();
            const orderSources = await getOrderSources();
            setOrderSources(orderSources);
        }
        fetchData();
    }, [])
    const changeOrderSourceID = e => {
        setOrderSourceID(e);
        setOrderSourceExt("");
        props.onChange({
            order_source_id: e,
            order_source_ext: orderSourceExt,
        });
    }
    const changeOrderSourceExt = e => {
        let text = e.target.value;
        setOrderSourceExt(text);
        props.onChange({
            order_source_id: orderSourceID,
            order_source_ext: text,
        });
    }

    return (
        <Space size={[8, 16]} wrap>
            <Col>
                <Select placeholder="请选择" style={{ width: 120 }} value={orderSourceID} onChange={changeOrderSourceID}>
                    {orderSources.map((os) => (
                        <Option key={os.is} value={os.id}>{os.name}</Option>
                    ))}
                </Select>
            </Col>
            <Col>
                <Input disabled={orderSourceID != 11} value={orderSourceExt} onChange={changeOrderSourceExt} />
            </Col>
        </Space>
    )
}
export default OrderSourceForm;
