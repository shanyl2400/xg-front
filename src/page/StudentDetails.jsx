import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Button, Card, Breadcrumb, message, Row, Col,Typography } from 'antd';
import { getStudentByIdAPI } from '../api/api';
const { Title } = Typography;
function StudentDetails(props) {
    const [student, setStudent] = useState({});
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
        }
        fetchData();
    }, []);

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
                <Breadcrumb.Item>学员名单</Breadcrumb.Item>
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
           
            <Row gutter={[16, 16]}>
                    <Col offset={22} span={1}><Button onClick={()=>history.goBack()}>返回</Button></Col>
            </Row>
            
        </div>
    );
}
export default StudentDetails;