import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tag, Space, Table, Pagination } from 'antd';
import { listAllStudentAPI } from '../api/api';
import { getStudentStatus } from '../utils/status';
import { useHistory } from "react-router-dom";
import StudentFilter from "../component/StudentFilter";

async function fetchStudent(page, curPageSize, data) {
  console.log(curPageSize);
  const rawRes = await listAllStudentAPI(page, curPageSize, data);
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
      created_at: createdAt.toLocaleString(),
      updated_at: updatedAt.toLocaleString(),
      address: rawStudents[i].address,
      telephone: rawStudents[i].telephone,
      intent_subject: rawStudents[i].intent_subject,
      status: rawStudents[i].status,
      author: rawStudents[i].authorName
    })
  }
  return students
}

function AllStudentList(props) {
  const columns = [
    {
      title: '录单员',
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
      dataIndex: 'address',
      key: 'address',
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
          {getStudentStatus(status)}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => history.push("/main/student_details/" + record.id)}>详情</a>
        </Space>
      ),
    },
  ];

  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState([0]);
  const [noDispatch, setNoDispatch] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  let history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      let res = await fetchStudent(pageIndex, pageSize, { status: status, noDispatch: noDispatch });
      setStudents(res);
    }
    fetchData();
  }, []);

  let handleChangePage = async (e, curPageSize) => {
    setPageIndex(e);
    setPageIndex(curPageSize);
    let res = await fetchStudent(e, curPageSize, { status: status, noDispatch: noDispatch });
    setStudents(res);
  }

  let handleStudentFilter = async e => {
    setStatus(e.status);
    setNoDispatch(e.noDispatch)
    let res = await fetchStudent(pageIndex, pageSize, e);
    setStudents(res);
  }

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>学员名单</Breadcrumb.Item>
      </Breadcrumb>

      <StudentFilter onFilterChange={handleStudentFilter} isDispatched={false} />
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={students.data} />
      <Pagination onChange={handleChangePage} defaultCurrent={pageIndex} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={students.total} />
    </div>
  );
}

export default AllStudentList;
