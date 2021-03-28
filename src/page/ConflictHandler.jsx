import React, { useState, useEffect } from 'react';
import { Breadcrumb, Modal, Space, Table, Button, Row, Col, Card, PageHeader, message } from 'antd';
import { useParams, useHistory, useLocation } from "react-router-dom";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserFilter from '../component/UserFilter';
import StudentDetailsModel from '../component/StudentDetailsModel';
import { listAllStudentAPI, updateStudentStatus, updateConflictStatus } from '../api/api';
import { parseAddress } from "../utils/address";
import { formatDate } from "../utils/date";
import { hideTelephone } from "../utils/telephone";
import { getStudentStatus } from "../utils/status";

const { confirm } = Modal;
const { Meta } = Card;
const pageSize = 0;
let pageIndex = 1;
let data = {
    name: "",
    roleID: 0,
    orgID: 0,
}
function ConflictHandler(props) {
    const columns = [
        {
            title: '录单员',
            dataIndex: 'authorName',
            key: 'authorName',
        },
        {
            title: '录单时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: created_at => (
                <span>{formatDate(new Date(Date.parse(created_at)))}</span>
            )
        },
        {
            title: '学生姓名',
            dataIndex: 'name',
            key: 'name',
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
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => openViewModel(record.id)}>查看</a>
                    {record.status == 2 && <a onClick={() => handleValid(record.id)}>设为有效</a>}
                    {(record.status == 1 || record.status == 3) && <a onClick={() => handleInvalid(record.id)}>设为无效</a>}
                </Space>
            ),
        },
    ];
    let [students, setStudents] = useState({ total: 0, data: [] });
    let [viewModelInfo, setViewModelInfo] = useState({
        visible: false,
        id: 0,
    });
    let { id } = useParams();
    const location = useLocation();
    let telephone = location.state.telephone;
    let history = useHistory();

    let handleValid = (studentId) => {
        confirm({
            icon: <CheckOutlined />,
            title: '确认设置名单为有效？',
            async onOk() {
                let res = await updateStudentStatus(studentId, 3);
                if (res.err_msg == "success") {
                    message.success("设置成功");
                } else {
                    message.error("设置失败，" + res.err_msg);
                }
                fetchData(1);
            },
            onCancel() {
            },
            content: (
                <>
                    将该名单设置为有效，名单将可以派单，是否设置为有效？
                </>
            ),
        });
    }
    let handleInvalid = (studentId) => {
        confirm({
            icon: <CloseOutlined />,
            title: '确认设置名单为无效？',
            async onOk() {
                let res = await updateStudentStatus(studentId, 2);
                if (res.err_msg == "success") {
                    message.success("设置成功");
                } else {
                    message.error("设置失败，" + res.err_msg);
                }
                fetchData(1);
            },
            onCancel() {
            },
            content: (
                <>
                    将该名单设置为无效，名单将无法派单，是否设置为无效？
                </>
            ),
        });
    }

    const handleRead = async e => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: '设置冲单为已处理？',
            async onOk() {
                let res = await updateConflictStatus(id, 2);
                if (res.err_msg == "success") {
                    message.success("设置成功");
                    history.goBack();
                } else {
                    message.error("设置失败，" + res.err_msg);
                }
            },
            onCancel() {
            },
            content: (
                <>
                    是否要将冲单记录设置为已处理？
                </>
            ),
        });
    }

    const fetchData = async (e) => {
        let res = await listAllStudentAPI(e, pageSize, { telephone: telephone });
        if (res.err_msg == "success") {
            setStudents({
                data: res.result.students,
                total: res.result.total,
            });
        } else {
            message.error("获取学员列表失败，" + res.err_msg);
            return
        }
    }

    const closeViewModel = () => {
        setViewModelInfo({
            visible: false,
            id: viewModelInfo.id,
        });
    }
    const openViewModel = (id) => {
        setViewModelInfo({ visible: true, id: id });
    }
    useEffect(() => {
        fetchData(pageIndex);
    }, []);

    const handleChangeFilter = v => {
        data.name = v.name;
        data.roleID = v.role;
        data.orgID = v.org;
        pageIndex = 1;
        console.log(v)
        fetchData(pageIndex, data);
    }
    return (
        <div class="app-main-page" style={{ padding: 40, height: "100%", width: "100%" }}>
            <PageHeader
                ghost={false}
                onBack={() => history.goBack()}
                title="冲单详情"
                subTitle="处理冲突订单信息详情"
                extra={
                    [<Button onClick={() => { handleRead() }}>设置为已处理</Button>]
                }
            ></PageHeader>
            <Table
                pagination={false}
                style={{ marginTop: "30px" }}
                columns={columns}
                dataSource={students.data} />

            <StudentDetailsModel
                visible={viewModelInfo.visible}
                closeModel={closeViewModel}
                id={viewModelInfo.id}
            />
        </div>
    );
}

export default ConflictHandler;
