import React, { useState, useEffect } from 'react';
import { Breadcrumb, DatePicker, message, Table, Pagination, Select } from 'antd';
import { listUsersWithOrgIdAPI, listOrderSourcesAPI, listOrgsAPI, getStatisticsTableGroupAPI } from '../api/api';

const { Option } = Select;
const { RangePicker } = DatePicker;
// const pageSize = 10;
// let pageIndex = 1;
const columns = [
    {
        title: '订单来源',
        dataIndex: 'group_name',
        key: 'group_name',
    },
    {
        title: '订单总量',
        dataIndex: 'orders',
        key: 'orders',
    },
    {
        title: '报名订单',
        dataIndex: 'signed_order',
        key: 'signed_order',
    },
    {
        title: '无效订单',
        dataIndex: 'invalid_orders',
        key: 'invalid_orders',
    },
    {
        title: '学生数量',
        dataIndex: 'students',
        key: 'students',
    },
    {
        title: '业绩',
        dataIndex: 'performance',
        key: 'performance',
    },
    {
        title: '成功率',
        dataIndex: 'succeed',
        key: 'succeed',
        render: succeed => (
            <span>
                {succeed / 100}%
            </span>
        ),
    },
];
function StatisticTable(props) {
    let [users, setUsers] = useState([]);
    let [orgs, setOrgs] = useState([]);
    let [orderSources, setOrderSources] = useState([]);
    let [selectOrgId, setSelectOrgId] = useState(0);
    let [selectAuthor, setSelectAuthor] = useState(0);
    let [selectPublisherId, setSelectPublisherId] = useState(0);
    let [selectOrderSource, setSelectOrderSource] = useState(0);
    let [selectTimeStamps, setSelectTimeStamps] = useState(null);
    let [dates, setDates] = useState([]);
    let [tableData, setTableData] = useState([]);
    useEffect(() => {
        const fetchData = async (filter) => {
            refreshStatistics(filter);
            let userRes = await listUsersWithOrgIdAPI(1, 0, 0);
            if (userRes.err_msg == "success") {
                console.log("user:", userRes.users);
                setUsers(userRes.users);
            } else {
                message.warning("获取用户信息失败：" + userRes.err_msg);
                return;
            }

            let osRes = await listOrderSourcesAPI();
            if (osRes.err_msg == "success") {
                console.log("or:", osRes.sources);
                setOrderSources(osRes.sources);
            } else {
                message.warning("获取订单来源信息失败：" + osRes.err_msg);
                return;
            }
            let orgRes = await listOrgsAPI();
            if (orgRes.err_msg == "success") {
                console.log("orgs:", orgRes.data.orgs);
                let tmpOrg = [];
                for (let i = 0; i < orgRes.data.orgs.length; i++) {
                    if (orgRes.data.orgs[i].id != 1) {
                        tmpOrg.push(orgRes.data.orgs[i]);
                    }
                }
                setOrgs(tmpOrg);
            } else {
                message.warning("获取机构信息失败：" + orgRes.err_msg);
                return;
            }
        }
        fetchData({
            org_id: selectOrgId,
            author: selectAuthor,
            publisher_id: selectPublisherId,
            order_source: selectOrderSource,
            time_stamp: null,
        });
    }, []);

    const refreshStatistics = async (filter) => {
        let res = await getStatisticsTableGroupAPI(filter);
        if (res.err_msg == "success") {
            console.log("res:", res.data);
            let data = res.data;
            if (data == null) {
                return;
            }
            let total = {
                group_id: 0,
                group_name: "总计",
                invalid_orders: 0,
                orders: 0,
                performance: 0,
                signed_order: 0,
                students: 0,
                succeed: 0,
            }
            for (let i = 0; i < data.length; i++) {
                total.invalid_orders += data[i].invalid_orders;
                total.orders += data[i].orders;
                total.performance += data[i].performance;
                total.signed_order += data[i].signed_order;
                total.students += data[i].students;
            }
            if (total.orders == 0) {
                total.succeed = 0;
            } else {
                total.succeed = total.signed_order * 1000 / total.orders;
            }
            console.log()
            data.push(total);
            setTableData(data);
        } else {
            console.log(res);
            message.warning("获取统计信息失败：" + res.err_msg);
            return;
        }

    }

    const handleUpdateOrg = e => {
        setSelectOrgId(e);
        refreshStatistics({
            org_id: e,
            author: selectAuthor,
            publisher_id: selectPublisherId,
            order_source: selectOrderSource,
            time_stamp: selectTimeStamps,
        });
    }
    const handleUpdateAuthor = e => {
        setSelectAuthor(e);
        refreshStatistics({
            org_id: selectOrgId,
            author: e,
            publisher_id: selectPublisherId,
            order_source: selectOrderSource,
            time_stamp: selectTimeStamps,
        });
    }
    const handleUpdatePublisherId = e => {
        setSelectPublisherId(e);
        refreshStatistics({
            org_id: selectOrgId,
            author: selectAuthor,
            publisher_id: e,
            order_source: selectOrderSource,
            time_stamp: selectTimeStamps,
        });
    }
    const handleUpdateOrderSource = e => {
        setSelectOrderSource(e);
        refreshStatistics({
            org_id: selectOrgId,
            author: selectAuthor,
            publisher_id: selectPublisherId,
            order_source: e,
            time_stamp: selectTimeStamps,
        });
    }

    const handleUpdateDates = val => {
        setDates(val);
        console.log(val);
        if (val == null) {
            refreshStatistics({
                org_id: selectOrgId,
                author: selectAuthor,
                publisher_id: selectPublisherId,
                order_source: selectOrderSource,
                time_stamp: null,
            });
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
        setSelectTimeStamps([startAt, endAt]);
        refreshStatistics({
            org_id: selectOrgId,
            author: selectAuthor,
            publisher_id: selectPublisherId,
            order_source: selectOrderSource,
            time_stamp: [startAt, endAt],
        });
    }

    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>统计数据</Breadcrumb.Item>
                <Breadcrumb.Item>统计表</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ marginBottom: 20, marginTop: 20 }}>
                <Select
                    defaultValue={0}
                    value={selectOrgId}
                    onChange={handleUpdateOrg}
                    style={{ width: 120, marginRight: 20 }} >
                    <Option value={0}>所有机构</Option>
                    {orgs.map((v) =>
                        <Option value={v.id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
                <Select
                    defaultValue={0}
                    value={selectAuthor}
                    onChange={handleUpdateAuthor}
                    style={{ width: 120, marginRight: 20 }}
                >
                    <Option value={0}>所有录单员</Option>
                    {users.map((v) =>
                        <Option value={v.user_id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
                <Select
                    value={selectPublisherId}
                    onChange={handleUpdatePublisherId}
                    defaultValue={0}
                    style={{ width: 120, marginRight: 20 }}
                >
                    <Option value={0}>所有派单员</Option>
                    {users.map((v) =>
                        <Option value={v.user_id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
                {/* <Select
                    value={selectOrderSource}
                    onChange={handleUpdateOrderSource}
                    defaultValue={0}
                    style={{ width: 120, marginRight: 20 }}
                >
                    <Option value={0}>所有来源</Option>
                    {orderSources.map((v) =>
                        <Option value={v.id} key={v.id}>{v.name}</Option>
                    )}
                </Select> */}
                <RangePicker
                    value={dates}
                    onCalendarChange={handleUpdateDates} />
            </div>
            <div style={{ marginTop: 20, marginLeft: "auto", marginRight: "auto" }}>
                <Table
                    pagination={false}
                    columns={columns}
                    dataSource={tableData}
                    bordered
                />
            </div>
        </div>

    );
}

export default StatisticTable;
