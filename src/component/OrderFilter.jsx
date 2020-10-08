import { Col, message, Row, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { listOrderSourcesAPI, listOrgsAPI, listUsersAPI } from "../api/api";

const { Option } = Select;
const { Search } = Input;
let querySubject = "";
let createdStartAt = "";
let createdEndAt = "";
function OrderFilter(props) {
    const [orgId, setOrgId] = useState(0);
    const [status, setStatus] = useState(0);
    const [timeDiff, setTimeDiff] = useState(0);
    const [orderSource, setOrderSource] = useState(0);
    const [selectItems, setSelectItems] = useState({});
    const fetchOrgs = async () => {
        let orgRes = await listOrgsAPI();
        if (orgRes.err_msg != "success") {
            message.error("无法获取机构列表");
            return;
        } else {

        }

        let orderSourceRes = await listOrderSourcesAPI();
        if (orderSourceRes.err_msg != "success") {
            message.error("无法获取机构列表");
            return;
        }

        setSelectItems({
            orgs: orgRes.data.orgs,
            orderSources: orderSourceRes.sources,
        });
    }
    useEffect(() => {
        fetchOrgs();
    }, []);
    let handleChangeStatus = e => {
        setStatus(e);

        props.onChangeFilter({
            status: e,
            orgId: orgId,
            orderSource: orderSource,
            subject: querySubject,
            createdStartAt: createdStartAt,
            createdEndAt: createdEndAt,
        })
    }

    let handleChangeOrderSoruces = e => {
        setOrderSource(e);
        props.onChangeFilter({
            status: status,
            orgId: orgId,
            orderSource: e,
            subject: querySubject,
            createdStartAt: createdStartAt,
            createdEndAt: createdEndAt,
        })
    }
    let handleChangeOrg = e => {
        setOrgId(e);
        props.onChangeFilter({
            status: status,
            orgId: e,
            orderSource: orderSource,
            subject: querySubject,
            createdStartAt: createdStartAt,
            createdEndAt: createdEndAt,
        })
    }

    let handleChangeSubject = e => {
        querySubject = e;
        props.onChangeFilter({
            status: status,
            orgId: orgId,
            orderSource: orderSource,
            subject: querySubject,
            createdStartAt: createdStartAt,
            createdEndAt: createdEndAt,
        })
    }
    let handleChangeTimeDiff = e =>{
        setTimeDiff(e);
        if(e > 0){
            let now = new Date();
            var late = new Date();
            late.setTime(late.getTime()-24*60*60*1000 * e);
            createdStartAt = (parseInt(late.getTime()/1000)).toString();
            createdEndAt = (parseInt(now.getTime()/1000)).toString();
        }else{
            createdStartAt = "";
            createdEndAt = "";
        }
        props.onChangeFilter({
            status: status,
            orgId: orgId,
            orderSource: orderSource,
            subject: querySubject,
            createdStartAt: createdStartAt,
            createdEndAt: createdEndAt,
        })
    }

    return (
        <div>
            <Row style={{ marginTop: 20, marginBottom: -10 }}>
                <Col>
                    机构：<Select defaultValue={0} style={{ width: 120 }} value={orgId} onChange={handleChangeOrg} >
                        <Option value={0}>全部</Option>
                        {selectItems.orgs != null && selectItems.orgs != undefined && selectItems.orgs.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>

                <Col offset={1}>
                    状态：<Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>未报名</Option>
                        <Option value={2}>已报名</Option>
                        <Option value={3}>
                            已退费
            </Option>
                    </Select>
                </Col>

                <Col offset={1}>
                    订单来源：<Select defaultValue={0} value={orderSource} style={{ width: 120 }} onChange={handleChangeOrderSoruces}>
                        <Option value={0}>全部</Option>
                        {selectItems.orderSources != null && selectItems.orderSources != undefined && selectItems.orderSources.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>

            </Row>
            <Row style={{ marginTop: 20, marginBottom: -10 }}>
                {/* <Col offset={0}>
                    派单人：<Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                        <Option value={0}>所有人</Option>
                    </Select>
                </Col> */}
                <Col offset={0}>
                    时间：<Select defaultValue={0} value={timeDiff} style={{ width: 120 }} onChange={handleChangeTimeDiff}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>今天</Option>
                        <Option value={3}>3天内</Option>
                        <Option value={7}>7天内</Option>
                        <Option value={30}>
                            30天内
                        </Option>
                    </Select>
                </Col>
                <Col offset={1}>
                    课程： <Search
                        placeholder="请输入课程名称"
                        onSearch={value => handleChangeSubject(value)}
                        style={{ width: 200 }}
                    />
                </Col>
            </Row>

        </div>
    );
}

export default OrderFilter;