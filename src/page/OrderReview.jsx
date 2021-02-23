import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, Pagination, Space, Table, message } from 'antd';
import ReviewOrderModel from '../component/ReviewOrderModel';
import { getPendingPaymentAPI } from '../api/api';
import { getPaymentStatus } from '../utils/status';

import { formatDate } from "../utils/date";
let pageSize = 10;
let currentPage = 1;
function OrderReview(props) {
  const columns = [
    {
      title: '派单员',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: createdAt => (
        <span>{formatDate(new Date(Date.parse(createdAt)))}</span>
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
          <a onClick={() => history.push("/main/order_details/" + record.order_id)}>详情</a>
          <a onClick={() => { setPaymentData(record); handleReviewOrderModel(true); }}>审批</a>
        </Space>
      ),
    },
  ];

  let history = useHistory();
  let [openReviewOrderModel, setOpenReviewOrderModel] = useState(false);
  let [paymentData, setPaymentData] = useState({ intent_subject: [] });
  let [paymentInfo, setPaymentInfo] = useState([]);
  let [paymentTotal, setPaymentTotal] = useState(0);

  let handleReviewOrderModel = (flag) => {
    setOpenReviewOrderModel(flag);
  }
  const fetchData = async () => {
    let res = await getPendingPaymentAPI(currentPage, pageSize);
    if (res.err_msg == "success") {
      setPaymentInfo(res.data.records);
      setPaymentTotal(res.data.total);
    } else {
      message.error("获取审核订单失败,", res.err_msg);
    }
  }
  const handleChangePage = e => {
    currentPage = e;
    fetchData();
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
      <Pagination showSizeChanger={false} onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={paymentTotal} />
      <ReviewOrderModel refreshData={fetchData} paymentData={paymentData} visible={openReviewOrderModel} closeModel={() => handleReviewOrderModel(false)} />
    </div>
  );
}

export default OrderReview;
