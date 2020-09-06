import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, Col, Input, Button, Row, message} from 'antd';
import { listOrderSourcesAPI, createOrderSourcesAPI } from '../api/api';
const data = [
  {
    "id":1,
    "name":"百度"
  },
  {
    "id":2,
    "name":"360"
  }
];
const total = 10;
const pageSize = 10;
function OrderResource(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单来源',
      dataIndex: 'name',
      key: 'name',
    }
  ];

  let [orderResources, setOrderResources] = useState([])
  let [orderResourceName, setOrderResourceName] = useState("")

  const fetchData = async () => {
    let res = await listOrderSourcesAPI();
    if(res.err_msg == "success"){
      setOrderResources(res.sources);
    }else{
      message.error("获取订单来源列表,", res.err_msg);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  const handleOrderSourceNameChange = e => {
    setOrderResourceName(e.target.value);
  }

  const handleAddOrderSource = async e => {
    let res = await createOrderSourcesAPI({
      name: orderResourceName,
    })
    if(res.err_msg == "success"){
      setOrderResourceName("");
      message.success("创建订单来源成功");
      fetchData();
    }else{
      message.error("创建订单来源失败,", res.err_msg);
    }
  }
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单列表</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
      <Col className="gutter-row" span={6}>
        <Table
          pagination={false}
          style={{ marginTop: "30px" }}
          columns={columns}
          dataSource={orderResources}
          />

      </Col>
      </Row>
     
     <Row style={{ marginTop:"20px" }}>
      <Col className="gutter-row" span={14}>
        
     <Row>
        <Col className="gutter-row" span={3}>
          订单来源：
        </Col>
        <Col className="gutter-row" span={8}>
          <Input placeholder="请填写要添加的订单来源名" value={orderResourceName} onChange={handleOrderSourceNameChange} />
        </Col>
        <Col style={{ marginLeft:"20px" }} className="gutter-row" span={2}>
          <Button type="primary" onClick={handleAddOrderSource}>添加</Button>
        </Col>
     </Row>
        
      </Col>
     </Row>
     
    
    </div>
  );
}

export default OrderResource;
