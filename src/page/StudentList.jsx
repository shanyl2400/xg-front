import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tag, Space, Table, Pagination, Select, Row, Col, message, Input } from 'antd';
import { listStudentAPI, listOrgsAPI } from '../api/api';
import { useHistory } from "react-router-dom";
import StudentFilter from "../component/StudentFilter";
import { parseAddress } from "../utils/address";

const pageSize = 10;
const { Option } = Select;
async function fetchStudent(page, pageSize, data) {
  const rawRes = await listStudentAPI(page, pageSize, data);
  const rawStudents = rawRes.result.students;
  let students = {
    total: rawRes.result.total,
    data: []
  };
  for (let i = 0; i < rawStudents.length; i++) {
    let createdAt = new Date(Date.parse(rawStudents[i].created_at));
    let updatedAt = new Date(Date.parse(rawStudents[i].updated_at));

    students.data.push({
      id: rawStudents[i].id,
      author_id: rawStudents[i].author,
      student_name: rawStudents[i].name,
      address: rawStudents[i].address,
      created_at: createdAt.toLocaleDateString(),
      updated_at: updatedAt.toLocaleDateString(),
      address_ext: rawStudents[i].address_ext,
      telephone: rawStudents[i].telephone,
      intent_subject: rawStudents[i].intent_subject,
      status: rawStudents[i].status,
      author: rawStudents[i].authorName
    })
  }
  return students
}

function getStatusName(status) {
  // StudentCreated = iota + 1
  // StudentConflictFailed
  // StudentConflictSuccess
  switch (status) {
    case 1:
      return <Tag color="green" key={1}>已创建</Tag>;
    case 2:
      return <Tag color="red" key={1}>冲单失败</Tag>;
    case 3:
      return <Tag color="yellow" key={1}>冲单成功</Tag>;
  }
}

let pageIndex = 1;
function StudentList(props) {
  const columns = [
    {
      title: '代理人',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '录单时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '学生姓名',
      dataIndex: 'student_name',
      key: 'student_name',
    },
    {
      title: '居住地址',
      key: 'address',
      render: (id, record) => (
        <span style={{ textOverflow: "ellipsis" }}>
          {parseAddress(record.address)}{record.address_ext}
        </span>
      ),
    },
    {
      title: '联系电话',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    // {
    //   title: '报名意向',
    //   dataIndex: 'intent_subject',
    //   key: 'intent_subject',
    // },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {getStatusName(status)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => history.push("/main/student_details/" + record.id)}>详情</a>
          <a onClick={() => history.push("/main/student_order/" + record.id)}>派单</a>
        </Space>
      ),
    },
  ];

  const [students, setStudents] = useState([]);

  let history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      let res = await fetchStudent(pageIndex, pageSize, { status: 0, noDispatch: false })
      setStudents(res);
    }
    fetchData();
  }, []);

  let handleChangePage = async e => {
    pageIndex = e
    let res = await fetchStudent(pageIndex, pageSize, { status: 0, noDispatch: false })
    setStudents(res);
  }

  let handleStudentFilter = async e => {
    let res = await fetchStudent(pageIndex, pageSize, e)
    setStudents(res);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>学员管理</Breadcrumb.Item>
        <Breadcrumb.Item>学员名单</Breadcrumb.Item>
      </Breadcrumb>
      <StudentFilter onFilterChange={handleStudentFilter} />
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={students.data} />
      <Pagination onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={students.total} />
    </div>
  );
}

export default StudentList;
