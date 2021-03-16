
import React, { useState, useEffect } from 'react';
import SummaryData from '../component/SummaryData';
import ReactEcharts from "echarts-for-react";
import { getStatisticsSummaryAPI, listUsersWithOrgIdAPI, getStatisticsTableAPI, listOrderSourcesAPI, listOrgsAPI } from '../api/api';
import { message, Typography, Statistic, Table, Select, Row, Col, Card } from 'antd';
import { PayCircleOutlined, TeamOutlined, RiseOutlined, BankOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
function NewDashboard(props) {
  let [data, setData] = useState({ x: [], studnetY: [], performanceY: [], ordersY: [], tableData: [] });
  let [summaryData, setSummaryData] = useState({ performance_total: 0, orgs_total: 0, students_total: 0, success_rate: 0 });
  let [users, setUsers] = useState([]);
  let [orgs, setOrgs] = useState([]);
  let [orderSources, setOrderSources] = useState([]);
  let [selectOrgId, setSelectOrgId] = useState(0);
  let [selectAuthor, setSelectAuthor] = useState(0);
  let [selectPublisherId, setSelectPublisherId] = useState(0);
  let [selectOrderSource, setSelectOrderSource] = useState(0);
  let studentOption = {
    title: {
      text: '录单量',
      textStyle: {
        //文字颜色
        color: '#333',
        //字体风格,'normal','italic','oblique'
        fontStyle: 'normal',
        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
        fontWeight: 'normal',
        //字体系列
        fontFamily: 'sans-serif',
        //字体大小
        fontSize: 16
      }
    },
    tooltip: {},
    legend: {
      x: 'center',
      bottom: 0,
      data: ['名单量']
    },
    xAxis: {
      data: data.x
    },
    yAxis: {},
    series: [{
      name: '名单量',
      type: 'bar',
      data: data.studnetY
    }]
  };

  let performanceOption = {
    title: {
      text: '业绩',
      textStyle: {
        //文字颜色
        color: '#333',
        //字体风格,'normal','italic','oblique'
        fontStyle: 'normal',
        //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
        fontWeight: 'normal',
        //字体系列
        fontFamily: 'sans-serif',
        //字体大小
        fontSize: 16
      }
    },
    tooltip: {},
    legend: {
      x: 'center',
      bottom: 0,
      data: ['业绩']
    },
    xAxis: {
      data: data.x
    },
    yAxis: {},
    series: [{
      name: '业绩',
      type: 'line',
      data: data.performanceY
    }]
  };
  const columns = [
    {
      title: '时间',
      dataIndex: 'name',
      key: 'name',
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
    });
  }, []);

  const refreshStatistics = async (filter) => {
    let res = await getStatisticsSummaryAPI();
    if (res.err_msg == "success") {
      setSummaryData(res.summary);
    } else {
      message.warning("获取统计信息失败：" + res.err_msg);
      return;
    }

    let res1 = await getStatisticsTableAPI(filter);
    if (res1.err_msg == "success") {
      let studentXseries = [];
      let studentYseries = [];
      let performanceYseries = [];
      let ordersYSeries = [];
      let data = res1.data.data;
      for (let i = 0; i < data.length; i++) {
        studentXseries.push((i + 1) + "月");
        studentYseries.push(data[i].students);
        performanceYseries.push(data[i].performance);
        ordersYSeries.push(data[i].orders);
      }

      setData({
        x: studentXseries,
        studnetY: studentYseries,
        performanceY: performanceYseries,
        ordersY: ordersYSeries,
        tableData: getTableData(res1.data)
      });
    } else {
      message.warning("获取统计表信息失败：" + res1.err_msg);
      return;
    }
  }

  const getTableData = (data) => {
    let tableData = [];
    tableData.push({
      name: "今天",
      invalid_orders: data.day_data.invalid_orders,
      orders: data.day_data.orders,
      performance: data.day_data.performance,
      signed_order: data.day_data.signed_order,
      students: data.day_data.students,
      succeed: data.day_data.succeed,
    });
    tableData.push({
      name: "本周",
      invalid_orders: data.week_day_data.invalid_orders,
      orders: data.week_day_data.orders,
      performance: data.week_day_data.performance,
      signed_order: data.week_day_data.signed_order,
      students: data.week_day_data.students,
      succeed: data.week_day_data.succeed,
    });
    tableData.push({
      name: "本月",
      invalid_orders: data.month_day_data.invalid_orders,
      orders: data.month_day_data.orders,
      performance: data.month_day_data.performance,
      signed_order: data.month_day_data.signed_order,
      students: data.month_day_data.students,
      succeed: data.month_day_data.succeed,
    });
    tableData.push({
      name: "近三月",
      invalid_orders: data.three_month_day_data.invalid_orders,
      orders: data.three_month_day_data.orders,
      performance: data.three_month_day_data.performance,
      signed_order: data.three_month_day_data.signed_order,
      students: data.three_month_day_data.students,
      succeed: data.three_month_day_data.succeed,
    });
    return tableData;
  }

  const handleUpdateOrg = e => {
    setSelectOrgId(e);
    refreshStatistics({
      org_id: e,
      author: selectAuthor,
      publisher_id: selectPublisherId,
      order_source: selectOrderSource,
    });
  }
  const handleUpdateAuthor = e => {
    setSelectAuthor(e);
    refreshStatistics({
      org_id: selectOrgId,
      author: e,
      publisher_id: selectPublisherId,
      order_source: selectOrderSource,
    });
  }
  const handleUpdatePublisherId = e => {
    setSelectPublisherId(e);
    refreshStatistics({
      org_id: selectOrgId,
      author: selectAuthor,
      publisher_id: e,
      order_source: selectOrderSource,
    });
  }
  const handleUpdateOrderSource = e => {
    setSelectOrderSource(e);
    refreshStatistics({
      org_id: selectOrgId,
      author: selectAuthor,
      publisher_id: selectPublisherId,
      order_source: e,
    });
  }


  return (
    <div style={{ padding: 0, height: "100%", width: "100%" }}>
      {/* <SummaryData color="#c23531" title="总业绩" data={"￥" + summaryData.performance_total} />
      <SummaryData color="#cd6d4b" title="总名单量" data={summaryData.students_total} />
      <SummaryData color="#61a0a8" title="机构数量" data={summaryData.orgs_total} />
      <SummaryData color="#2f4554" title="成功率" data={summaryData.success_rate / 100 + "%"} /> */}
      <Row gutter={8} style={{ marginBottom: 10 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总业绩"
              value={summaryData.performance_total}
              precision={2}
              // valueStyle={{ color: '#3f8600' }}
              prefix={<PayCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总名单量"
              value={summaryData.students_total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="机构数量"
              value={summaryData.orgs_total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功率"
              value={summaryData.success_rate / 100}
              precision={2}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>


      <Card title="统计信息">

        <div>
          <Table
            pagination={false}
            columns={columns}
            dataSource={data.tableData}
            size="small"
            bordered
          />
        </div>
      </Card>
      <Card title="统计表" style={{ marginTop: 20 }}>
        <Row >
          <Col span={12}>
            <ReactEcharts
              option={studentOption}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"} />
          </Col>
          <Col span={12}>
            <ReactEcharts
              option={performanceOption}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"} />
          </Col>
        </Row>
      </Card>


    </div>
  );
}
export default NewDashboard;