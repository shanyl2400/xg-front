import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tag, Space, Table, Pagination, Select, Row, Col, message, Input } from 'antd';
import { listStudentAPI, listOrgsAPI } from '../api/api';
import { useHistory } from "react-router-dom";
import StudentFilter from "../component/StudentFilter";
import { parseAddress } from "../utils/address";
import { formatDate } from "../utils/date";
import { hideTelephone } from "../utils/telephone";
import { getStudentStatus } from "../utils/status";
import { showTotal } from '../utils/page';

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
      created_at: formatDate(createdAt),
      updated_at: formatDate(updatedAt),
      order_count: rawStudents[i].order_count,
      address_ext: rawStudents[i].address_ext,
      telephone: rawStudents[i].telephone,
      intent_subject: rawStudents[i].intent_subject,
      status: rawStudents[i].status,
      author: rawStudents[i].authorName
    })
  }
  return students
}

function StudentList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => (
        <span>{index + 1 + ((pageIndex - 1) * pageSize)}</span>
      )
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
      render: telephone => (
        <span>
          {hideTelephone(telephone)}
        </span>)
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
          <a onClick={() => history.push("/main/student_order/" + record.id)}>派单({record.order_count})</a>
        </Space>
      ),
    },
  ];

  const [students, setStudents] = useState([]);

  const [filter, setFilter] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  let history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      let res = await fetchStudent(pageIndex, pageSize, filter)
      setStudents(res);
    }
    fetchData();
  }, []);

  let handleChangePage = async (e, curPageSize) => {
    setPageIndex(e);
    setPageSize(curPageSize);
    let res = await fetchStudent(e, curPageSize, filter)
    setStudents(res);
  }

  let handleStudentFilter = async e => {
    setFilter(e);
    let res = await fetchStudent(pageIndex, pageSize, e)
    setStudents(res);
  }

  const handleRowClass = (record, index) => {
    switch (record.status) {
      case 1:
        //新建
        return "new-student-table-row";
      case 2:
        //无效
        return "invalid-student-table-row";
      case 3:
        //有效
        return "valid-student-table-row";

    }
    return "";
  }
  return (
    <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>学员管理</Breadcrumb.Item>
        <Breadcrumb.Item>我的名单</Breadcrumb.Item>
      </Breadcrumb>
      <StudentFilter hideAuthor={true} status={[]} onFilterChange={handleStudentFilter} isDispatched={false} />
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        rowClassName={handleRowClass}
        dataSource={students.data} />
      <Pagination
        onChange={handleChangePage}
        style={{ textAlign: "right", marginTop: 10 }}
        defaultPageSize={pageSize}
        size="small"
        showTotal={showTotal}
        total={students.total} />
    </div>
  );
}

export default StudentList;
