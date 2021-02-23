import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Breadcrumb, message, Space, Table, Pagination, Dropdown, Menu, Modal } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listOrgOrdersAPI, invalidOrderAPI, revokeOrderAPI } from '../api/api';
import { getOrderStatus } from '../utils/status';
import OrderPayModel from '../component/OrderPayModel'
import OrderDepositModel from '../component/OrderDepositModel'
import OrderSignupModel from '../component/OrderSignupModel'
import { hideTelephone } from "../utils/telephone";

import { formatDate } from "../utils/date";
const pageSize = 10;
let currentPage = 1;
const { confirm } = Modal;
function OrgOrderList(props) {
  const columns = [
    {
      title: '录单员',
      dataIndex: 'author_name',
      key: 'author_name',
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
      render: telephone => (
        <span>
          {hideTelephone(telephone)}
        </span>)
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
          <Dropdown overlay={getMenu(record)} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              操作<DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const getMenu = record => {
    return (
      <Menu >
        {record.status == 1 && <Menu.Item key="1"> <a onClick={() => handleInvalidOrder(record.id)}>无效</a></Menu.Item>}
        {record.status == 1 && <Menu.Item key="2"><a onClick={() => handleOpenDepositOrderModel(record.id)}>交定金</a></Menu.Item>}
        {(record.status == 1 || record.status == 5) && <Menu.Item key="3"><a onClick={() => handleOpenSignupOrderModel(record.id)}>报名</a></Menu.Item>}
        {(record.status == 2 || record.status == 5) && <Menu.Item key="4"> <a onClick={() => handleOpenPayOrderModel(record.id)}>缴费</a></Menu.Item>}
        {(record.status == 2 || record.status == 5) && <Menu.Item key="5"> <a onClick={() => handleRevokeOrder(record.id)}>退学</a></Menu.Item>}
      </Menu>
    )
  }

  let history = useHistory();
  let [orders, setOrders] = useState({ total: 0 })
  let [signupOrderModelVisible, setSignupOrderModelVisible] = useState(false);
  let [depositOrderModelVisible, setDepositOrderModelVisible] = useState(false);
  let [payOrderModelVisible, setPayOrderModelVisible] = useState(false);
  let [orderId, setOrderId] = useState(0);
  const fetchData = async (index) => {
    let res = await listOrgOrdersAPI(index, pageSize);
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
    fetchData(currentPage);
  }, []);

  let handleChangePage = (page) => {
    fetchData(page);
    currentPage = page;
  }

  let handleCloseSignupOrderModel = () => {
    setSignupOrderModelVisible(false);
  }
  let handleCloseDepositOrderModel = () => {
    setDepositOrderModelVisible(false);
  }
  let handleOpenSignupOrderModel = (id) => {
    setOrderId(id);
    setSignupOrderModelVisible(true);
  }

  let handleOpenDepositOrderModel = (id) => {
    setOrderId(id);
    setDepositOrderModelVisible(true);
  }

  let handleClosePayOrderModel = () => {
    setPayOrderModelVisible(false);
  }
  let handleOpenPayOrderModel = (id) => {
    setOrderId(id);
    setPayOrderModelVisible(true);
  }

  let handleInvalidOrder = (id) => {
    setOrderId(id);
    confirm({
      title: '无效订单',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认设置该订单为无效订单',
      okText: "是",
      cancelText: "否",
      async onOk() {
        let res = await invalidOrderAPI(id);
        if (res.err_msg == "success") {
          message.success("设置成功");
          fetchData(currentPage);
        } else {
          message.error("设置失败，" + res.err_msg);
        }
      },
      onCancel() {
      },
    });
  }

  let handleRevokeOrder = (id) => {
    setOrderId(id);
    confirm({
      title: '退学',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认该学员退学？',
      okText: "是",
      cancelText: "否",
      async onOk() {
        let res = await revokeOrderAPI(id);
        if (res.err_msg == "success") {
          message.success("设置成功");
          fetchData(currentPage);
        } else {
          message.error("设置失败，" + res.err_msg);
        }
      },
      onCancel() {
      },
    });
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
      <Pagination showSizeChanger={false} onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={orders.total} />

      <OrderSignupModel refreshData={() => fetchData(currentPage)} id={orderId} visible={signupOrderModelVisible} closeModel={handleCloseSignupOrderModel} />
      <OrderDepositModel refreshData={() => fetchData(currentPage)} id={orderId} visible={depositOrderModelVisible} closeModel={handleCloseDepositOrderModel} />
      <OrderPayModel refreshData={() => fetchData(currentPage)} id={orderId} visible={payOrderModelVisible} closeModel={handleClosePayOrderModel} />
    </div>
  );
}

export default OrgOrderList;
