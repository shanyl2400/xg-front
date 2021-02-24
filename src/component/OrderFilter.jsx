import { Col, message, Row, Select, Input, DatePicker, Radio, TreeSelect, Cascader, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { listOrderSourcesAPI, listOrgsAPI, listUsersWithOrgIdAPI, listSubjectsTreeAPI, exportOrdersAPI } from "../api/api";
import { ExportOutlined } from '@ant-design/icons';
import options from '../component/address';

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
let createdStartAt = "";
let createdEndAt = "";

async function getOrderSources() {
    let rawSources = await listOrderSourcesAPI();
    if (rawSources.err_msg != "success") {
        message.error("无法获取订单来源信息：", rawSources.err_msg);
        return [];
    }
    return rawSources.sources;
}
async function getUsers() {
    let users = await listUsersWithOrgIdAPI(1);
    if (users.err_msg != "success") {
        message.error("无法获取订单来源信息：", users.err_msg);
        return [];
    }
    return users.users;
}


function OrderFilter(props) {
    const [orgId, setOrgId] = useState(0);
    const [status, setStatus] = useState(0);
    const [orderSource, setOrderSource] = useState(0);
    const [selectItems, setSelectItems] = useState({});
    const [dates, setDates] = useState([]);
    const [author, setAuthor] = useState(0);
    const [address, setAddress] = useState("");
    const [subject, setSubject] = useState();
    const [orderBy, setOrderBy] = useState(1);

    const [querySubject, setQuerySubject] = useState("");
    const [subjectValue, setSubjectValue] = useState([]);

    const [startAt, setStartAt] = useState(null);
    const [endAt, setEndAt] = useState(null);

    const [formDatas, setFormDatas] = useState({
        subjectsTree: [],
        orderSources: [],
        users: [],
    });

    const getFilter = () => {
        return {
            status: status,
            orgId: orgId,
            orderSource: orderSource,
            query: querySubject,
            startAt: startAt,
            endAt: endAt,
            author: author,
            address: address,
            subject: subjectValue,

            orderBy: orderBy,
        }
    }


    const fetchOrgs = async () => {
        let orgRes = await listOrgsAPI();
        if (orgRes.err_msg != "success") {
            message.error("无法获取机构列表");
            return;
        }

        let orderSourceRes = await listOrderSourcesAPI();
        if (orderSourceRes.err_msg != "success") {
            message.error("无法获取机构列表");
            return;
        }

        setSelectItems({
            orgs: orgRes.data.orgs,
            orderSources: orderSourceRes.sources,
        });
    }
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
    useEffect(() => {
        fetchOrgs();
        fetchData();
    }, []);
    let handleChangeStatus = e => {
        setStatus(e);
        let filter = getFilter();
        filter.status = e;
        props.onChangeFilter(filter);
    }

    let handleChangeOrderSoruces = e => {
        setOrderSource(e);
        let filter = getFilter();
        filter.orderSource = e;
        props.onChangeFilter(filter);
    }
    let handleChangeOrg = e => {
        setOrgId(e);
        let filter = getFilter();
        filter.orgId = e;
        props.onChangeFilter(filter)
    }

    let handleChangeSubject = e => {
        setQuerySubject(e);
        let filter = getFilter();
        filter.query = e;
        props.onChangeFilter(filter);
    }

    const changeAuthor = e => {
        setAuthor(e);
        let filter = getFilter();
        filter.author = e;
        props.onChangeFilter(filter);
    }
    const changeSubjects = e => {
        setSubject(e);

        let filter = getFilter();
        let subject = "";
        if (e != null) {
            subject = e.value;
        }
        filter.subject = subject;
        props.onChangeFilter(filter);
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
        props.onChangeFilter(filter);
    }
    const changeOrderBy = e => {
        let value = e.target.value;
        setOrderBy(value);

        let filter = getFilter();
        filter.orderBy = value;
        props.onChangeFilter(filter);
    }
    const changeTimeRange = val => {
        setDates(val);

        let filter = getFilter();
        if (val == null) {
            filter.startAt = null;
            filter.endAt = null;
            setStartAt(null);
            setEndAt(null);
            props.onChangeFilter(filter);
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

        filter.startAt = startAt;
        filter.endAt = endAt;
        setStartAt(startAt);
        setEndAt(endAt);
        props.onChangeFilter(filter);
    }
    const addrFilter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }
    const doExport = () => {
        confirm({
            title: '确认导出?',
            icon: <ExportOutlined />,
            content: '是否确认导出派单记录？',
            onOk() {
                exportOrdersAPI(getFilter());
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
        <div>
            <Row style={{ marginTop: 20 }}>
                <Col>
                    机构：<Select defaultValue={0} style={{ width: 120 }} value={orgId} onChange={handleChangeOrg} >
                        <Option value={0}>全部</Option>
                        {selectItems.orgs != null && selectItems.orgs != undefined && selectItems.orgs.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>

                <Col offset={1}>
                    状态：<Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>未报名</Option>
                        <Option value={2}>已报名</Option>
                        <Option value={3}>
                            已退费
            </Option>
                    </Select>
                </Col>

                {props.hideAuthor ? "" : (<Col offset={1}>
                    录单员：
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
                    </Select>
                </Col>)}

            </Row>
            <Row style={{ marginTop: 20 }}>

                <Col>
                    地址：<Cascader
                        showSearch={{ addrFilter }}
                        options={options}
                        placeholder="请选择"
                        value={address}
                        onChange={changeAddress}
                        changeOnSelect />
                </Col>
                <Col offset={1}>
                    订单来源：<Select defaultValue={0} value={orderSource} style={{ width: 120 }} onChange={handleChangeOrderSoruces}>
                        <Option value={0}>全部</Option>
                        {selectItems.orderSources != null && selectItems.orderSources != undefined && selectItems.orderSources.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col offset={1} span={4}>
                    <TreeSelect
                        treeData={formDatas.subjectsTree}
                        style={{ width: "100%" }}
                        placeholder='请选择专业'
                        value={subject}
                        allowClear={true}
                        onChange={changeSubjects}
                        labelInValue={true}
                    />
                </Col>

            </Row>
            <Row style={{ marginTop: 20 }}>
                <Col >
                    搜索： <Search
                        placeholder="请输入搜索内容"
                        onSearch={value => handleChangeSubject(value)}
                        style={{ width: 200 }}
                    />
                </Col>
                <Col offset={1} span={6}>
                    <RangePicker
                        value={dates}
                        onCalendarChange={changeTimeRange} />
                </Col>
                <Col offset={1}>
                    排序：
                    <Radio.Group value={orderBy} onChange={changeOrderBy}>
                        <Radio.Button value={1}>派单时间</Radio.Button>
                        <Radio.Button value={2}>回访时间</Radio.Button>
                    </Radio.Group>
                </Col>

                {props.hasExport && (<Col offset={1}>
                    {/* <Button onClick={doExport}>导出</Button> */}
                    <Button onClick={doExport} icon={<ExportOutlined />} >导出</Button>
                </Col>)}
            </Row>

        </div>
    );
}

export default OrderFilter;