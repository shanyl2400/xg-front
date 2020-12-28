import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, Tag, Space, Table, Pagination, message } from 'antd';
import ReviewOrderModel from '../component/ReviewOrderModel';
import { getPendingPaymentAPI } from '../api/api';
import { getPaymentStatus } from '../utils/status';

function OrderReview(props) {
  const columns = [
    {
      title: '代理人',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: createdAt => (
        <span>{new Date(Date.parse(createdAt)).toLocaleDateString()}</span>
      ),
    },
    {
      title: '学生姓名',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: '推荐机构',
      dataIndex: 'org_name',
      key: 'org_name',
    },
    {
      title: '费用说明',
      dataIndex: 'title',
      key: 'title',
    },
    // {
    //   title: '推荐科目',
    //   dataIndex: 'intent_subject',
    //   key: 'intent_subject',
    // },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={record.mode == 1 ? { "color": "#52c41a" } : { "color": "#f5222d" }}>
          {record.mode == 1 ? "+" : "-"}{amount}
        </span>
      ),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {getPaymentStatus(status)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => history.push("/main/order_details/" + record.id)}>详情</a>
          <a onClick={() => { setPaymentData(record); handleReviewOrderModel(true); }}>审批</a>
        </Space>
      ),
    },
  ];

  let history = useHistory();
  let [openReviewOrderModel, setOpenReviewOrderModel] = useState(false);
  let [paymentData, setPaymentData] = useState({ intent_subject: [] });
  let [paymentInfo, setPaymentInfo] = useState([]);

  let handleReviewOrderModel = (flag) => {
    setOpenReviewOrderModel(flag);
  }
  const fetchData = async () => {
    let res = await getPendingPaymentAPI();
    if (res.err_msg == "success") {
      setPaymentInfo(res.data.records);
      console.log(res.data)
    } else {
      message.error("获取审核订单失败,", res.err_msg);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单审核</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={paymentInfo}
      />

      <ReviewOrderModel refreshData={fetchData} paymentData={paymentData} visible={openReviewOrderModel} closeModel={() => handleReviewOrderModel(false)} />
    </div>
  );
}

export default OrderReview;
