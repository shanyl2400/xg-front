import React, { useState, useEffect } from 'react';
import { Button, Card, Breadcrumb, message, Row, Col, Select, Typography } from 'antd';
import { useParams, useHistory } from "react-router-dom";
import { getStudentByIdAPI, listSubOrgsAPI, createOrderAPI, getOrgSubjectsAPI } from '../api/api';

const { Title } = Typography;
const { Option } = Select;
function CreateStudentOrder(props) {
    const [student, setStudent] = useState({});
    const [orgs, setOrgs] = useState([]);
    const [curOrg, setCurOrg] = useState(null);
    const [curSubjects, setCurSubjects] = useState([]);

    const [subject, setSubject] = useState("")
    let { id } = useParams();
    let history = useHistory();
    useEffect(() => {
        const fetchData = async () => {
            const res = await getStudentByIdAPI(id);
            if (res.err_msg == "success") {
                setStudent(res.student);
            } else {
                message.warn("查不到学生信息");
                history.goBack();
            }

            const orgRes = await listSubOrgsAPI();
            if (orgRes.err_msg == "success") {
                console.log(orgRes.data.orgs)
                setOrgs(orgRes.data.orgs);
            } else {
                message.warn("查不到机构信息");
                history.goBack();
            }
        }
        
        console.log("Fetch data STUDENT ID:", id);
        fetchData();
    }, [id])

    let handleChangeOrg = async index=>{
        let res = await getOrgSubjectsAPI(orgs[index].id);
        if(res.err_msg == "success"){
            setCurOrg(orgs[index]);
            setCurSubjects(res.subjects);
            setSubject("");
        }else{
            message.error("获取机构信息失败,", res.err_msg);
        }

    }
    let handleChangeSubject = data =>{
        setSubject(data);
    }

    let handleCreateOrder = async ()=>{
        if(curOrg == null){
            message.warn("请选择机构")
            return;
        }
        if(subject == ""){
            message.warn("请选择推荐科目");
            return;
        }

        let res = await createOrderAPI({
            student_id: parseInt(id),
            to_org_id: curOrg.id,
            intent_subjects: [subject],
        })
        console.log(res)
        if(res.err_msg == "success"){
            message.success("派单成功");
            history.goBack();
        }else{
            message.error("派单失败");
        }
    }
    let getStatusName = (id) => {
        switch(id){
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
                    <Col span={12}>居住地址：{student.address}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>邮箱：{student.email}</Col>
                    <Col span={12}>订单来源：{student.order_source_name}</Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>报名意向：
                        <ul style={{margin:"10px 10px"}}>
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

            {student.orders != undefined && student.orders.length > 0? <Title level={4}>已推荐机构</Title>: ""}
            {student.orders != undefined && student.orders.map((order)=>(
            <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]} key={order.id}>
                        <Col span={12}>推荐机构：{order.org_name}</Col>
                </Row>
                <Row gutter={[16, 16]} key={order.id}>
                        <Col span={12}>推荐学科：{order.intent_subject}</Col>
                </Row>
                <Row gutter={[16, 16]} key={order.id}>
                        <Col span={12}>状态：{getStatusName(order.status)}</Col>
                </Row>
            </Card>
            ))}

            <Card style={{ width: "100%", margin: "20px 5px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={2}>派单给：</Col>
                    <Col span={12}>
                    <Select defaultValue="请选择" style={{  width: 180 }} onChange={handleChangeOrg}>
                        {orgs.length > 0 && orgs.map((org, index)=>(
                            <Option value={index}>{org.name}</Option>
                        ))}
                    </Select>

                    <Select value={subject} defaultValue="请选择" style={{ marginLeft:15,width: 160 }} onChange={handleChangeSubject}>
                    {curSubjects != null && curSubjects.map((name)=>(
                            <Option value={name}>{name}</Option>
                        ))}
                    </Select>

                    </Col>
                </Row>
            </Card>
            <Row gutter={[16, 16]}>
            <Col offset={18} span={2}><Button type="primary" onClick={()=>handleCreateOrder()}>派单</Button></Col>
            <Col span={2}><Button onClick={()=>history.goBack()}>返回</Button></Col>
            </Row>
            
        </div>
    );
}
export default CreateStudentOrder;