import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, message, Space, Table, Pagination } from 'antd';
import { listOrgOrdersAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
import OrderPayModel from '../component/OrderPayModel'
import OrderSignupModel from '../component/OrderSignupModel'

const total = 10;
const pageSize = 10;
let currentPage = 1;
function OrgOrderList(props) {
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
          {record.status == 1 ?  <a onClick={() => handleOpenSignupOrderModel(record.id)}>报名</a>:<span></span>}
          <a onClick={()=>handleOpenPayOrderModel(record.id)}>缴费</a>
        </Space>
      ),
    },
  ];
  let history = useHistory();
  let [orders, setOrders] = useState({total:0})
  let [signupOrderModelVisible, setSignupOrderModelVisible] = useState(false);
  let [payOrderModelVisible, setPayOrderModelVisible] = useState(false);
  let [orderId, setOrderId] = useState(0);
  const fetchData = async (index) => {
    let res = await listOrgOrdersAPI(index, pageSize);
    if(res.err_msg == "success"){
      setOrders({
        total: res.data.total,
        data: res.data.orders
      });
    }else{
      message.error("获取订单失败");
    }
  }
  useEffect(() => {
    fetchData(currentPage);
  }, []);
  
  let handleChangePage = (page)=>{
    fetchData(page);
    currentPage = page;
  }

  let handleCloseSignupOrderModel = () =>{
    setSignupOrderModelVisible(false);
  }
  let handleOpenSignupOrderModel = (id) => {
    setOrderId(id);
    setSignupOrderModelVisible(true);
  }

  let handleClosePayOrderModel = () =>{
    setPayOrderModelVisible(false);
  }
  let handleOpenPayOrderModel = (id) => {
    setOrderId(id);
    setPayOrderModelVisible(true);
  }
 
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
       <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>名单列表</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={orders.data}
         />
      <Pagination onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={total} />
     
      <OrderSignupModel refreshData={()=>fetchData(currentPage)} id={orderId} visible={signupOrderModelVisible} closeModel={handleCloseSignupOrderModel}/>
      <OrderPayModel refreshData={()=>fetchData(currentPage)} id={orderId} visible={payOrderModelVisible} closeModel={handleClosePayOrderModel}/>
    </div>
  );
}

export default OrgOrderList;
