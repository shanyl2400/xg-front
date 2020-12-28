import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, message, Space, Table, Pagination } from 'antd';
import { listAuthOrdersAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
import OrderFilter from "../component/OrderFilter";
const pageSize = 10;
let pageIndex = 1;
let queryValue = {};
function AuthorOrderList(props) {
  const columns = [
    {
      title: '代理人',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
    },
    {
      title: '派单时间',
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
      title: '联系电话',
      dataIndex: 'student_telephone',
      key: 'student_telephone',
    },
    {
      title: '推荐科目',
      dataIndex: 'intent_subject',
      key: 'intent_subject',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {getOrderStatus(status)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => history.push("/main/order_details/" + record.id)}>详情</a>
        </Space>
      ),
    },
  ];
  let history = useHistory();
  let [orders, setOrders] = useState({ total: 0 })
  const fetchData = async (index, value) => {
    let res = await listAuthOrdersAPI(index, pageSize, value);
    if (res.err_msg == "success") {
      setOrders({
        total: res.data.total,
        data: res.data.orders
      });
    } else {
      message.error("获取订单失败");
    }

  }
  useEffect(() => {
    fetchData(1, null);
  }, []);

  let handleChangePage = (page) => {
    fetchData(page, queryValue);
  }
  let handleChangeFilter = value => {
    queryValue = value;
    fetchData(pageIndex, value);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>我的订单</Breadcrumb.Item>
      </Breadcrumb>
      <OrderFilter onChangeFilter={handleChangeFilter}></OrderFilter>
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={orders.data}
      />
      <Pagination onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={orders.total} />

    </div>
  );
}

export default AuthorOrderList;
