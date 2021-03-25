import { Col, Row, Select, Input, Form, Cascader, TreeSelect, Space } from "antd";
import React, { useState, useEffect } from 'react';
import { listSubjectsTreeAPI } from "../api/api";
import options from '../component/address';

const { Option } = Select;
const { Search } = Input;
function StudentConflictFilter(props) {
    const [status, setStatus] = useState(1);

    let handleChangeStatus = e => {
        setStatus(e);
        let filter = getFilter();
        filter.status = e;
        props.onChangeFilter(filter);
    }
    let handleChangeTelephone = e => {
        let filter = getFilter();
        filter.telephone = e;
        props.onChangeFilter(filter);
    }

    const getFilter = () => {
        return {
            status: status,
        }
    }
    return (
        <Space size={[30, 0]} style={{ marginTop: 20 }} wrap>
            {props.hideStatus ? "" : <Form.Item
                label="状态："
            >
                <Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>未处理</Option>
                    <Option value={2}>已处理</Option>
                </Select>
            </Form.Item>}

            <Form.Item
                label="搜索"
            >
                <Search
                    placeholder="请输入冲突电话"
                    onSearch={handleChangeTelephone}
                    style={{ width: 200 }}
                />
            </Form.Item>
        </Space>
    );
}

export default StudentConflictFilter;