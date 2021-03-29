import { Col, Space, Select, Input, TreeSelect, Form, Cascader, Button, DatePicker, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { listOrgsAPI, listSubjectsTreeAPI, exportStudentsAPI, listOrderSourcesAPI, listUsersWithOrgIdAPI } from '../api/api';
import options from '../component/address';
import { ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
async function getOrderSources() {
    let rawSources = await listOrderSourcesAPI();
    if (rawSources.err_msg != "success") {
        message.error("无法获取订单来源信息：" + rawSources.err_msg);
        return [];
    }
    return rawSources.sources;
}
async function getUsers() {
    let users = await listUsersWithOrgIdAPI(1);
    if (users.err_msg != "success") {
        message.error("无法获取订单来源信息：" + users.err_msg);
        return [];
    }
    return users.users;
}

async function getParentOrgs() {
    let parentOrgsRes = await listOrgsAPI(0, 0);
    let orgs = [];
    if (parentOrgsRes.err_msg == "success") {
        for (let i = 0; i < parentOrgsRes.data.orgs.length; i++) {
            if (parentOrgsRes.data.orgs[i].id != 1) {
                orgs.push(parentOrgsRes.data.orgs[i])
            }
        }
        return orgs
    } else {
        message.warn("查不到机构选项");
        return null;
    }
}
function StudentFilter(props) {
    const [status, setStatus] = useState(props.status);
    const [isDispatched, setIsDispatched] = useState(props.isDispatched);
    const [keywords, setKeywords] = useState("");

    const [author, setAuthor] = useState(0);
    const [orderSource, setOrderSource] = useState(0);
    const [subject, setSubject] = useState();
    const [address, setAddress] = useState("");
    const [dates, setDates] = useState([]);
    const [datesValue, setDatesValue] = useState([]);
    const [subjectValue, setSubjectValue] = useState([]);

    const [formDatas, setFormDatas] = useState({
        subjectsTree: [],
        orderSources: [],
        users: [],
    });
    const doExport = () => {
        confirm({
            title: '确认导出?',
            icon: <ExportOutlined />,
            content: '是否确认导出学员名单？',
            onOk() {
                exportStudentsAPI(getFilter());
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    let getFilter = () => {
        return {
            status: status,
            noDispatch: isDispatched,
            keywords: keywords,
            author: author,
            orderSource: orderSource,
            subject: subjectValue,
            address: address,
            timeRange: datesValue
        }
    }

    let handleChangeStatus = async e => {
        setStatus(e);
        let filter = getFilter();
        filter.status = e;
        props.onFilterChange(filter);
    }

    const handleChangeIsDispatch = async e => {
        setIsDispatched(e);

        let filter = getFilter();
        filter.noDispatch = e;
        props.onFilterChange(filter);
    }
    const handleChangeSearch = e => {
        let filter = getFilter();
        filter.keywords = e;
        props.onFilterChange(filter);
    }

    const changeAuthor = e => {
        setAuthor(e);

        let filter = getFilter();
        filter.author = e;
        props.onFilterChange(filter);
    }
    const changeOrderSource = e => {
        setOrderSource(e);

        let filter = getFilter();
        filter.orderSource = e;
        props.onFilterChange(filter);
    }
    const changeSubjects = e => {
        setSubject(e);

        let filter = getFilter();
        let subject = "";
        if (e != null) {
            subject = e.value;
        }
        filter.subject = subject;
        props.onFilterChange(filter);
        setSubjectValue(subject);
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
        props.onFilterChange(filter);
    }
    const changeTimeRange = val => {
        setDates(val);

        let filter = getFilter();
        if (val == null) {
            filter.timeRange = [];
            setDatesValue([]);
            props.onFilterChange(filter);
            return;
        }
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

        filter.timeRange = [startAt, endAt];
        setDatesValue([startAt, endAt]);
        props.onFilterChange(filter);
    }
    const addrFilter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    useEffect(() => {
        const fetchData = async () => {
            // const sub = await getSubjects();
            const orderSources = await getOrderSources();
            const subjectsTree = await listSubjectsTreeAPI();
            const users = await getUsers(1);
            setFormDatas({
                orderSources: orderSources,
                subjectsTree: subjectsTree,
                users: users,
            });
        }
        fetchData();
    }, [])
    return (
        <Space size={[30, 0]} style={{ marginTop: 20, marginBottom: -10 }} wrap>
            <Form.Item
                label="状态："
            >
                <Select mode="multiple" value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                    {/* <Option value={0}>全部</Option> */}
                    <Option value={1}>已创建</Option>
                    <Option value={3}>冲单成功</Option>
                    <Option value={2}>冲单失败</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="类型："
            >
                <Select value={isDispatched} style={{ width: 120 }} onChange={handleChangeIsDispatch}>
                    <Option value={false}>所有名单</Option>
                    <Option value={true}>未派名单</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="订单来源："
            >
                <Select defaultValue={0} value={orderSource} style={{ width: 120 }} onChange={changeOrderSource}>
                    <Option value={0} key={0}>所有来源</Option>
                    {formDatas.orderSources != null && formDatas.orderSources.map((v) =>
                        <Option value={v.id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
            </Form.Item>
            {props.hideAuthor ? "" : (
                <Form.Item
                    label="录单员："
                >
                    <Select
                        defaultValue={0}
                        style={{ width: 140 }}
                        value={author}
                        onChange={changeAuthor}
                        showSearch={true}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value={0} key={0}>所有人</Option>
                        {formDatas.users != null && formDatas.users.map((v) =>
                            <Option value={v.user_id} key={v.user_id}>{v.name}</Option>
                        )}
                    </Select></Form.Item>
            )}

            <Form.Item
                label="专业："
                style={{ width: 200 }}
            >
                <TreeSelect
                    treeData={formDatas.subjectsTree}
                    style={{ width: "100%" }}
                    placeholder='请选择专业'
                    value={subject}
                    allowClear={true}
                    onChange={changeSubjects}
                    labelInValue={true}
                />
            </Form.Item>
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
                label="日期："
            >
                <RangePicker
                    value={dates}
                    onCalendarChange={changeTimeRange} />
            </Form.Item>
            <Form.Item
                label="搜索："
            >
                <Search
                    placeholder="请输入搜索内容"
                    onSearch={value => handleChangeSearch(value)}
                    style={{ width: 200 }}
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                />
            </Form.Item>
            {props.hasExport && (<Form.Item
            >

                {/* <Button onClick={doExport}>导出</Button> */}
                <Button onClick={doExport} icon={<ExportOutlined />} >导出</Button>
            </Form.Item>
            )}
        </Space>

    )
}
export default StudentFilter;