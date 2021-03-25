import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table, Pagination, Dropdown, Menu } from 'antd';
import { useHistory } from "react-router-dom";
import { listConflictStudents } from '../api/api';
import { getConflictStatus } from '../utils/status';
import { formatDate } from '../utils/date';
import StudentConflictFilter from '../component/StudentConflictFilter';

const pageSize = 10;
let pageIndex = 1;
function ConflictList(props) {
    const columns = [
        {
            title: '录单人',
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: '冲突联系方式',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: '冲突时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: updated_at => (
                <span>{formatDate(new Date(Date.parse(updated_at)))}</span>
            ),
        },
        {
            title: '冲突数',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <span>
                    {getConflictStatus(status)}
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => {
                        history.push({
                            pathname: "/main/conflict_student/" + record.id,
                            state: {
                                telephone: record.telephone
                            }
                        });

                    }}>处理</a>
                </Space>
            ),
        },
    ];
    let history = useHistory();
    let [studentList, setStudentList] = useState({
        total: 0,
        records: [],
    });

    const fetchData = async (page, data) => {
        let res = await listConflictStudents(page, pageSize, data);
        if (res.err_msg == "success") {
            setStudentList({
                total: res.result.total,
                records: res.result.records
            });

        } else {
            message.warning("获取冲单列表失败：" + res.err_msg);
            return;
        }
    }
    useEffect(() => {
        fetchData(pageIndex, { status: 1 });
    }, []);

    let handleChangePage = page => {
        pageIndex = page;
        fetchData(pageIndex, { status: 1 });
    }
    let handleChangeQuery = query => {
        pageIndex = 1;
        fetchData(pageIndex, query);
    }

    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>学员管理</Breadcrumb.Item>
                <Breadcrumb.Item>冲单列表</Breadcrumb.Item>
            </Breadcrumb>
            <StudentConflictFilter
                onChangeFilter={handleChangeQuery}
            />
            <Table
                pagination={false}
                style={{ marginTop: 20 }}
                columns={columns}
                dataSource={studentList.records}
            />
            <Pagination showSizeChanger={false} onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={studentList.total} />
        </div>
    );
}

export default ConflictList;
