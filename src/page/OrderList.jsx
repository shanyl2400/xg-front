import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import {Breadcrumb, message, Space, Table, Pagination, Row, Col, Select} from 'antd';
import { listOrdersAPI, listOrgsAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
import OrderFilter from "../component/OrderFilter";
const pageSize = 10;
const { Option } = Select;

let pageIndex = 1;
function OrderList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '代理人',
      dataIndex: 'publisher_name',
      key: 'publisher_name',
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
  let [orders, setOrders] = useState({total:0});

  const fetchData = async (index, data) => {
    let res = await listOrdersAPI(index, pageSize, data);
    if(res.err_msg == "success"){
      setOrders({
        total: res.data.total,
        data: res.data.orders
      });
    }else{
      message.error("获取订单失败：");
    }
  }

  useEffect(() => {
    fetchData(1, null);
  }, []);
  
  let handleChangePage = (page)=>{
    pageIndex = page;
    fetchData(page, null);
  }

  let handleChangeFilter = value=>{
    console.log(value);
    fetchData(pageIndex, value);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
       <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单列表</Breadcrumb.Item>
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

export default OrderList;
