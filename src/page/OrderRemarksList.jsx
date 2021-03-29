import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table, Pagination } from 'antd';
import { useHistory } from "react-router-dom";
import { listOrderRemarks, marksOrderRemarksRead } from '../api/api';
import { showTotal } from '../utils/page';

const pageSize = 10;
let currentPage = 1;
function OrderRemarksList(props) {
  const columns = [
    {
      title: '时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: createdAt => (
        <span>{createdAt.replace(/T/g, " ").replace(/Z/g, "")}</span>
      ),
    },
    // {
    //   title: '作者',
    //   dataIndex: 'mode',
    //   key: 'mode',
    //   render: (mode) => (
    //     <Space size="middle">
    //       {mode == 1 ? "学果网" : "机构用户"}
    //     </Space>
    //   ),
    // },
    {
      title: '信息',
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: '备注',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => { history.push("/main/order_details/" + record.order_id) }}>详情</a>
          <a onClick={() => { handleMarkRead(record.id) }}>标记已读</a>
        </Space>
      ),
    },
  ];

  let [remarksTotal, setRemarksTotal] = useState(0);
  let [records, setRecords] = useState([]);
  let history = useHistory();

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const fetchData = async (page, data) => {
    data = { status: 1 }
    let res = await listOrderRemarks(page, pageSize, data);
    if (res.records != null) {
      setRemarksTotal(res.total);
      setRecords(res.records)
    }
  }


  const handleChangePage = page => {
    currentPage = page;
    fetchData(currentPage);
  }
  const handleMarkRead = async id => {
    let res = await marksOrderRemarksRead(id);
    if (res.err_msg == "success") {
      message.success("标记已读");
    } else {
      message.error("标记失败：" + res.err_msg);
    }
    fetchData(currentPage);
  }

  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>消息中心</Breadcrumb.Item>
        <Breadcrumb.Item>回访记录</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={records}
      />
      <Pagination
        showSizeChanger={false}
        onChange={handleChangePage}
        style={{ textAlign: "right", marginTop: 10 }}
        defaultPageSize={pageSize}
        size="small"
        showTotal={showTotal}
        total={remarksTotal} />
    </div>
  );
}

export default OrderRemarksList;
