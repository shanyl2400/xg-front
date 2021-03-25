import { Col, Row, Select, Input, Form, Cascader, TreeSelect, Space } from "antd";
import React, { useState, useEffect } from 'react';
import { listSubjectsTreeAPI } from "../api/api";
import options from '../component/address';

const { Option } = Select;
const { Search } = Input;
function OrgFilter(props) {
    const [status, setStatus] = useState(0);
    const [address, setAddress] = useState("");
    const [subjects, setSubjects] = useState();
    const [formDatas, setFormDatas] = useState({
        subjectsTree: [],
        orderSources: [],
        users: [],
    });
    const fetchData = async () => {
        const subjectsTree = await listSubjectsTreeAPI();
        setFormDatas({
            subjectsTree: subjectsTree,
        });
    }
    useEffect(() => {
        fetchData();
    }, []);
    let handleChangeQuery = e => {
        let filter = getFilter();
        filter.keywords = e;
        props.onChangeFilter(filter);
    }
    const addrFilter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }
    let handleChangeStatus = e => {
        setStatus(e);
        let filter = getFilter();
        filter.status = e;
        props.onChangeFilter(filter);
    }
    const changeSubjects = e => {
        let filter = getFilter();
        let subject = "";
        if (e != null) {
            subject = e.value;
            setSubjects(e.value);
        }
        filter.subjects = subject;
        props.onChangeFilter(filter);
    }
    const changeAddress = e => {
        setAddress(e);
        let address = "";
        for (let i = 0; i < e.length; i++) {
            if (address != "") {
                address = address + "-";
            }
            address = address + e[i];
        }

        let filter = getFilter();
        filter.address = address;
        props.onChangeFilter(filter);
    }
    const getFilter = () => {
        return {
            status: status,
            subjects: subjects,
            address: address,
        }
    }
    return (
        <Space size={[30, 0]} style={{ marginTop: 20 }} wrap>
            {props.hideStatus ? "" : <Form.Item
                label="状态："
            >
                <Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                    <Option value={0}>全部</Option>
                    <Option value={1}>待审核</Option>
                    <Option value={2}>合作中</Option>
                    <Option value={3}>黑名单</Option>
                    <Option value={5}>已过期</Option>
                </Select>
            </Form.Item>}

            <Form.Item
                label="地址："
            >
                <Cascader
                    showSearch={{ addrFilter }}
                    options={options}
                    placeholder="请选择"
                    value={address}
                    onChange={changeAddress}
                    changeOnSelect />
            </Form.Item>
            <Form.Item
                label="专业："
                style={{ width: 200 }}
            >
                <TreeSelect
                    treeData={formDatas.subjectsTree}
                    style={{ width: "100%" }}
                    placeholder='请选择专业'
                    value={subjects}
                    allowClear={true}
                    onChange={changeSubjects}
                    labelInValue={true}
                />
            </Form.Item>
            <Form.Item
                label="搜索"
            >
                <Search
                    placeholder="请输入搜索内容"
                    onSearch={handleChangeQuery}
                    style={{ width: 200 }}
                />
            </Form.Item>
        </Space>
    );
}

export default OrgFilter;