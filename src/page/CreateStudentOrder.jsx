import React, { useState, useEffect } from 'react';
import { Button, Card, Breadcrumb, message, Row, Col, Select, Typography, Table, Pagination } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import SubOrgFilter from '../component/SubOrgFilter';
import CreateOrderModal from '../component/CreateOrderModal';
import { getStudentByIdAPI, listSubOrgsAPI, listOrgsAPI } from '../api/api';
import { parseAddress } from '../utils/address';

const { Title } = Typography;
const { Option } = Select;
const pageSize = 5;
// let curPage = 1;
function CreateStudentOrder(props) {
    const [curPage, SetCurPage] = useState(1);
    const [allSucjects, setAllSubjects] = useState([]);
    let { id } = useParams();
    let history = useHistory();
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '校区名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '校区地址',
            key: 'address',
            render: (text, record) => (
                <span>
                    {parseAddress(record.address)}{record.address_ext}
                </span>
            ),
        },
        {
            title: '学科',
            dataIndex: 'subjects',
            key: 'subjects',
        },
        {
            title: '联系电话',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: '距离',
            key: 'distance',
            render: (text, record) => (
                <span>
                    {record.distance.toFixed(2)}km
                </span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => openCreateOrderModal(record)}>派单</a>
                </span>
            ),
        },
    ];
    const [student, setStudent] = useState({});
    const [orgs, setOrgs] = useState({
        data: [],
        total: 0,
    });
    const [orgQueryParams, setOrgQueryParams] = useState({
        student_id: id,
        address: "",
        parent_id: 0,
        subjects: ""
    })
    const [createOrderModalVisible, setCreateOrderModalVisible] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getStudentByIdAPI(id);
            if (res.err_msg == "success") {
                setStudent(res.student);
            } else {
                message.warn("查不到学生信息");
                history.goBack();
            }
            let s = buildIntentSubjects(res.student.intent_subject)

            setAllSubjects(s);
            setOrgQueryParams({
                student_id: id,
                address: "",
                parent_id: 0,
                subjects: s,
            })
            const orgRes = await listSubOrgsAPI({
                student_id: id,
                address: "",
                parent_id: 0,
                subjects: s,
            }, 1, pageSize);
            if (orgRes.err_msg == "success") {
                console.log("total:", orgRes.data.total);
                setOrgs({
                    data: orgRes.data.orgs,
                    total: orgRes.data.total
                });
            } else {
                message.warn("查不到机构信息");
                history.goBack();
            }

        }

        fetchData();
    }, [id])

    const searchOrgs = async (orgQueryParams, curPage) => {
        const orgRes = await listSubOrgsAPI(orgQueryParams, curPage, pageSize);
        if (orgRes.err_msg == "success") {
            setOrgs({
                data: orgRes.data.orgs,
                total: orgRes.data.total
            });
        } else {
            message.warn("查不到机构信息");
            history.goBack();
        }
    }
    const openCreateOrderModal = record => {
        setSelectedOrg(record)
        setCreateOrderModalVisible(true);
    }
    const closeCreateOrderModal = () => {
        setCreateOrderModalVisible(false);
    }

    const buildIntentSubjects = values => {
        let res = [];
        for (let i = 0; i < values.length; i++) {
            let parts = values[i].split("-");
            if (parts.length < 2) {
                console.error("invalid subject");
                continue;
            }
            res.push(parts[0] + "-" + parts[1]);
        }
        return res;
    }

    let getStatusName = (id) => {
        switch (id) {
            case 1:
                return "已创建";
            case 2:
                return "已报名，待审核";
            case 3:
                return "收支变更，待确认";
            case 4:
                return "已确认";
        }
    }
    const handleChangePage = e => {
        SetCurPage(e);
        searchOrgs(orgQueryParams, e);
    }
    const handleFilter = async e => {
        let subjects = allSucjects;
        if (!e.isFilter) {
            subjects = [];
        }
        setOrgQueryParams({
            student_id: id,
            address: e.address,
            parent_id: e.parent_id,
            subjects: subjects,
        })
        searchOrgs({
            student_id: id,
            address: e.address,
            parent_id: e.parent_id,
            subjects: subjects,
        }, curPage);
        // const orgRes = await listSubOrgsAPI({
        //     student_id: id,
        //     address: e.address,
        //     subjects: subjects,
        //     parent_id: e.parent_id,
        // }, curPage, pageSize);
        // if (orgRes.err_msg == "success") {
        //     setOrgs({
        //         data: orgRes.data.orgs,
        //         total: orgRes.data.total
        //     });

        // } else {
        //     message.warn("查不到机构信息");
        //     history.goBack();
        // }
    }
    return (
        <div style={{ padding: 40, height: "100%", width: "100%" }}>
            <Breadcrumb>
                <Breadcrumb.Item>学员管理</Breadcrumb.Item>
                <Breadcrumb.Item>创建订单</Breadcrumb.Item>
            </Breadcrumb>
            <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={12}>姓名：{student.name}</Col>
                    <Col span={12}>性别：{student.gender ? "男" : "女"}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>手机号：{student.telephone}</Col>
                    <Col span={12}>居住地址：{parseAddress(student.address)}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>邮箱：{student.email}</Col>
                    <Col span={12}>订单来源：{student.order_source_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名意向：
                        <ul style={{ margin: "10px 10px" }}>
                            {student.intent_subject != undefined && student.intent_subject.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>备注：{student.note}</Col>
                </Row>
            </Card>

            {student.orders != undefined && student.orders.length > 0 ? <Title level={4}>已推荐机构</Title> : ""}
            {student.orders != undefined && student.orders.map((order) => (
                <Card style={{ width: "100%", margin: "20px 5px" }} key={"card-" + order.id}>
                    <Row gutter={[16, 16]} key={"key-" + order.id}>
                        <Col span={12}>推荐机构：{order.org_name}</Col>
                    </Row>
                    <Row gutter={[16, 16]} key={"sub-" + order.id}>
                        <Col span={12}>推荐学科：{order.intent_subject}</Col>
                    </Row>
                    <Row gutter={[16, 16]} key={"status-" + order.id}>
                        <Col span={12}>状态：{getStatusName(order.status)}</Col>
                    </Row>
                </Card>
            ))}

            <SubOrgFilter onFilterChange={handleFilter} />
            <Table
                pagination={false}
                style={{ marginTop: "30px" }}
                columns={columns}
                dataSource={orgs.data}
            />
            <Pagination onChange={handleChangePage} style={{ textAlign: "right", marginTop: 10 }} defaultPageSize={pageSize} size="small" total={orgs.total} />

            <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
                {/* <Col offset={18} span={2}><Button type="primary" onClick={() => handleCreateOrder()}>派单</Button></Col> */}
                <Col offset={22} span={2}><Button onClick={() => history.goBack()}>返回</Button></Col>
            </Row>
            <CreateOrderModal studentId={id} visible={createOrderModalVisible} org={selectedOrg} closeModel={closeCreateOrderModal} />
        </div>
    );
}
export default CreateStudentOrder;