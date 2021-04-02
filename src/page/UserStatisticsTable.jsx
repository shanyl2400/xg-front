import React, { useState, useEffect } from 'react';
import { Breadcrumb, DatePicker, message, Descriptions, Pagination, Select } from 'antd';
import { getOrderStatistics, getOrderPaymentStatistics, getStudentsStatistics } from '../api/api';
import StatisticsFilter from '../component/StatisticsFilter';

function UserStatisticTable(props) {
    let [paymentData, setPaymentData] = useState([]);
    let [orderData, setOrderData] = useState([]);
    let [studentData, setStudentData] = useState([]);

    const refreshStatistics = async (filter) => {
        filter.pay_record_status = "2,5"
        let res = await getOrderPaymentStatistics(filter);
        if (res.err_msg == "success") {
            setPaymentData(res.result);
        } else {
            message.warning("获取统计信息失败：" + res.err_msg);
            return;
        }
        let res2 = await getOrderStatistics(filter);
        if (res2.err_msg == "success") {
            setOrderData(res2.result);
        } else {
            message.warning("获取统计信息失败：" + res2.err_msg);
            return;
        }

        let res3 = await getStudentsStatistics(filter);
        if (res3.err_msg == "success") {
            setStudentData(res3.result);
        } else {
            message.warning("获取统计信息失败：" + res3.err_msg);
            return;
        }
    }
    const handleChangeFilter = filter => {
        refreshStatistics(filter);
    }
    const calcCountByStatus = (data, status) => {
        let ret = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].status == status || status == 0) {
                ret = ret + data[i].count;
            }
        }
        return ret
    }
    const calcAmountByStatus = (data, status) => {
        let ret = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].status == status || status == 0) {
                ret = ret + data[i].amount;
            }
        }
        return ret
    }
    const calcSucceed = () => {
        let succeed = 0;
        let all = 0;
        if (orderData.length == 0) {
            return 0;
        }
        for (let i = 0; i < orderData.length; i++) {
            if (orderData[i].status == 2 || orderData[i].status == 6) {
                succeed = succeed + orderData[i].count;
            }
            all = all + orderData[i].count
        }
        return succeed / all;
    }
    const TableData = (
        <div style={{ width: "60%", margin: "0 auto" }}>
            <Descriptions bordered>
                <Descriptions.Item label="录单总量" span={3}>
                    {calcCountByStatus(studentData, 0)}
                </Descriptions.Item>
                <Descriptions.Item label="冲单数" span={3}>
                    {calcCountByStatus(studentData, 2)}
                </Descriptions.Item>
                <Descriptions.Item label="派单总量" span={3}>
                    {calcCountByStatus(orderData, 0)}
                </Descriptions.Item>
                <Descriptions.Item label="已报名" span={3}>
                    {calcCountByStatus(orderData, 2)}
                </Descriptions.Item>
                <Descriptions.Item label="交定金" span={3}>
                    {calcCountByStatus(orderData, 6)}
                </Descriptions.Item>
                <Descriptions.Item label="无效派单" span={3}>
                    {calcCountByStatus(orderData, 4)}
                </Descriptions.Item>
                <Descriptions.Item label="业绩" span={3}>
                    {calcAmountByStatus(paymentData, 0)}元
                </Descriptions.Item>
                <Descriptions.Item label="成功率" span={3}>
                    {Number((calcSucceed()).toString().match(/^\d+(?:\.\d{0,2})?/))}%
                  </Descriptions.Item>

            </Descriptions>

        </div>
    )
    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>统计数据</Breadcrumb.Item>
                <Breadcrumb.Item>员工数据</Breadcrumb.Item>
            </Breadcrumb>

            <div>
                <StatisticsFilter
                    onChangeFilter={handleChangeFilter}
                    hasAllOrgs={true}
                />
            </div>
            <div style={{ marginTop: 20, marginLeft: "auto", marginRight: "auto" }}>
                {/* {paymentData.length == 0 ? <Empty /> : TableData} */}
                {TableData}
            </div>
        </div>

    );
}

export default UserStatisticTable;
