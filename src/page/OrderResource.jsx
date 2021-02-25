import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, Col, Input, Button, Row, Space, Modal, message } from 'antd';
import { listOrderSourcesAPI, createOrderSourcesAPI, deleteOrderSourcesAPI } from '../api/api';
import { DeleteOutlined } from '@ant-design/icons';
const { confirm } = Modal;

function OrderResource(props) {
  const columns = [
    {
      title: '订单来源',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => deleteOrderSourceByID(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  let [orderResources, setOrderResources] = useState([])
  let [orderResourceName, setOrderResourceName] = useState("")

  const fetchData = async () => {
    let res = await listOrderSourcesAPI();
    if (res.err_msg == "success") {
      setOrderResources(res.sources);
    } else {
      message.error("获取订单来源列表," + res.err_msg);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleOrderSourceNameChange = e => {
    setOrderResourceName(e.target.value);
  }
  const deleteOrderSourceByID = async id => {
    confirm({
      title: '确认删除?',
      icon: <DeleteOutlined />,
      content: '是否确认删除订单来源，删除后订单来源的统计数据将归入其他来源？',
      async onOk() {
        let res = await deleteOrderSourcesAPI(id);
        if (res.err_msg == "success") {
          message.success("删除订单来源成功");
          fetchData();
        } else {
          message.error("删除订单来源失败：" + res.err_msg);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleAddOrderSource = async e => {
    let res = await createOrderSourcesAPI({
      name: orderResourceName,
    })
    if (res.err_msg == "success") {
      setOrderResourceName("");
      message.success("创建订单来源成功");
      fetchData();
    } else {
      message.error("创建订单来源失败," + res.err_msg);
    }
  }
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单来源列表</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col className="gutter-row" span={18}>
          <Table
            pagination={false}
            style={{ marginTop: "30px" }}
            columns={columns}
            dataSource={orderResources}
          />

        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
        <Col className="gutter-row" span={14}>

          <Row>
            <Col className="gutter-row" span={3}>
              订单来源：
        </Col>
            <Col className="gutter-row" span={8}>
              <Input placeholder="请填写要添加的订单来源名" value={orderResourceName} onChange={handleOrderSourceNameChange} />
            </Col>
            <Col style={{ marginLeft: "20px" }} className="gutter-row" span={2}>
              <Button type="primary" onClick={handleAddOrderSource}>添加</Button>
            </Col>
          </Row>

        </Col>
      </Row>


    </div>
  );
}

export default OrderResource;
