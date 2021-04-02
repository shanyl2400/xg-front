
import React, { useState, useEffect, useRef } from 'react';
import SummaryData from '../component/SummaryData';
import ReactEcharts from "echarts-for-react";
import { getStatisticsSummaryAPI, getOrgSalesRankingAPI, getOrgDispatchRankingAPI, getStatisticsTableAPI, getEnterRankingAPI, listOrderSourcesAPI, listOrgsAPI } from '../api/api';
import { message, Typography, Statistic, Table, Select, Row, Col, Card } from 'antd';
import { PayCircleOutlined, TeamOutlined, RiseOutlined, BankOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
function NewDashboard(props) {
  let [data, setData] = useState({ x: [], studnetY: [], performanceY: [], ordersY: [], tableData: [] });
  let [summaryData, setSummaryData] = useState({ performance_total: 0, orgs_total: 0, students_total: 0, success_rate: 0 });
  let [selectOrgId, setSelectOrgId] = useState(0);
  let [selectAuthor, setSelectAuthor] = useState(0);
  let [selectPublisherId, setSelectPublisherId] = useState(0);
  let [selectOrderSource, setSelectOrderSource] = useState(0);

  let [enterRank, setEnterRank] = useState([]);
  let [orgSalesRank, setOrgSalesRank] = useState([]);
  let [orgDispatchRank, setOrgDispathRank] = useState([]);
  let [enterRankTabKey, setEnterRankTabKey] = useState('tab1');
  let [orgRankTabKey, setOrgRankTabKey] = useState('tab1');
  let studentOption = {
    color: ["#d48265"],
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

  let enterRankGraphOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '录单量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: enterRank,
      }
    ]
  }

  let orgSalesRankGraphOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: orgSalesRank,
      }
    ]
  }
  let performanceOption = {
    color: ["#546570"],
    legend: {
      x: 'center',
      bottom: 0,
      data: ['业绩']
    },
    xAxis: {
      data: data.x
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '业绩',
      type: 'line',
      smooth: true,
      areaStyle: {},
      data: data.performanceY
    }]
  };
  const columns = [
    {
      title: '时间',
      dataIndex: 'name',
      key: 'name',
      width: 80,
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
  const enterRankTab = [
    {
      key: 'tab1',
      tab: '员工录单排名',
    },
    {
      key: 'tab2',
      tab: '统计图',
    },
  ];

  const orgRankTab = [
    {
      key: 'tab1',
      tab: '机构派单排名',
    },
    {
      key: 'tab2',
      tab: '机构派单统计图',
    },
    {
      key: 'tab3',
      tab: '统计图',
    },
  ];
  const enterRankColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id, record, index) => (
        <span>
          {index + 1}
        </span>
      ),
    },
    {
      title: '录单人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '录单量',
      dataIndex: 'count',
      key: 'count',
    }
  ];

  const orgDispatchRankColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id, record, index) => (
        <span>
          {index + 1}
        </span>
      ),
    },
    {
      title: '机构',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '派单量',
      dataIndex: 'count',
      key: 'count',
    }
  ];

  const orgSalesRankColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id, record, index) => (
        <span>
          {index + 1}
        </span>
      ),
    },
    {
      title: '机构',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '销售额',
      dataIndex: 'amount',
      key: 'amount',
    }
  ];

  const fetchRankData = async () => {
    let res = await getEnterRankingAPI();
    if (res.err_msg == "success") {
      if (res.result != null) {
        for (let i = 0; i < res.result.length; i++) {
          res.result[i].value = res.result[i].count;
        }
        setEnterRank(res.result);
      }
    } else {
      message.error("获取录单排名失败，", res.err_msg);
      return
    }

    res = await getOrgSalesRankingAPI();
    if (res.err_msg == "success") {
      if (res.result != null) {
        for (let i = 0; i < res.result.length; i++) {
          res.result[i].value = res.result[i].amount;
        }
        setOrgSalesRank(res.result);
      }
    } else {
      message.error("获取销售额排名失败，", res.err_msg);
      return
    }

    res = await getOrgDispatchRankingAPI();
    if (res.err_msg == "success") {
      if (res.result != null) {
        for (let i = 0; i < res.result.length; i++) {
          res.result[i].value = res.result[i].count;
        }
        setOrgDispathRank(res.result);
      }
    } else {
      message.error("获取派单排名失败，", res.err_msg);
      return
    }
  }
  const fetchData = async (filter) => {
    refreshStatistics(filter);
    fetchRankData();
  }
  useEffect(() => {
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

  const enterRankTabList = {
    "tab1": <Table
      pagination={false}
      columns={enterRankColumns}
      dataSource={enterRank}
      size="small"
      bordered
    />,
    "tab2": <div>
      <ReactEcharts
        option={enterRankGraphOption}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"} />
    </div>
  }
  const orgRankTabList = {
    "tab1": <Table
      pagination={false}
      columns={orgDispatchRankColumns}
      dataSource={orgDispatchRank}
      size="small"
      bordered
    />,
    "tab2": <Table
      pagination={false}
      columns={orgSalesRankColumns}
      dataSource={orgSalesRank}
      size="small"
      bordered
    />,
    "tab3": <ReactEcharts
      option={orgSalesRankGraphOption}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"} />
  }

  return (
    <div style={{ padding: 0, height: "100%", width: "100%" }}>
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
      <Row style={{ marginTop: 20 }} gutter={[16, 24]}>
        <Col span={12}>
          <Card
            tabList={enterRankTab}
            activeTabKey={enterRankTabKey}
            style={{ height: 360 }}
            onTabChange={key => {
              setEnterRankTabKey(key);
            }}
          >
            {enterRankTabList[enterRankTabKey]}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            tabList={orgRankTab}
            activeTabKey={orgRankTabKey}
            style={{ height: 360 }}
            onTabChange={key => {
              setOrgRankTabKey(key);
            }}
          >
            {orgRankTabList[orgRankTabKey]}
          </Card>
        </Col>
      </Row>
      <Card title="统计信息" style={{ marginTop: 20 }}>
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
      <Row style={{ marginTop: 20 }} gutter={[16, 24]}>
        <Col span={12}>
          <Card title="录单统计图" >
            <ReactEcharts
              option={studentOption}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="销售额统计图" >
            <ReactEcharts
              option={performanceOption}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"} />
          </Card>
        </Col>
      </Row>


    </div >
  );
}
export default NewDashboard;