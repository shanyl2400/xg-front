import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, message, Space, Table, Pagination, Row, Col, Select } from 'antd';
import { listOrdersAPI, listOrgsAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
import OrderFilter from "../component/OrderFilter";
import { formatDate } from "../utils/date";
const pageSize = 10;
const { Option } = Select;

let pageIndex = 1;
let queryValue = {};
function OrderList(props) {
  const columns = [
    // {
    //   title: '#',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: '派单员',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
    },
    {
      title: '派单时间',
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
  let [orders, setOrders] = useState({ total: 0 });

  const fetchData = async (index, pageSize, data) => {
    let res = await listOrdersAPI(index, pageSize, data);
    if (res.err_msg == "success") {
      setOrders({
        total: res.data.total,
        data: res.data.orders
      });
    } else {
      message.error("获取订单失败：");
    }
  }

  useEffect(() => {
    fetchData(1, pageSize, null);
  }, []);

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  let handleChangePage = (page, curPageSize) => {
    setPageIndex(page);
    setPageSize(curPageSize);
    fetchData(page, curPageSize, queryValue);
  }

  let handleChangeFilter = value => {
    queryValue = value
    fetchData(pageIndex, pageSize, value);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>派单记录</Breadcrumb.Item>
      </Breadcrumb>

      <OrderFilter onChangeFilter={handleChangeFilter} hasExport={true}></OrderFilter>

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

export default OrderList;
