import {Col, message, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import {listOrgsAPI} from "../api/api";

const { Option } = Select;
function OrderFilter(props) {
    const [orgId, setOrgId] = useState(0);
    const [orgs, setOrgs] = useState([]);
    const [status, setStatus] = useState(0);
    const fetchOrgs = async () => {
        let orgRes = await listOrgsAPI();
        if(orgRes.err_msg == "success"){
            setOrgs(orgRes.data.orgs);
        }else{
            message.error("无法获取机构列表");
        }
    }
    useEffect(() => {
        fetchOrgs();
    }, []);
    let handleChangeStatus = e => {
        setStatus(e);

        props.onChangeFilter({
            status: e,
            orgId: orgId,
        })
    }
    let handleChangeOrg = e => {
        setOrgId(e);
        props.onChangeFilter({
            status: status,
            orgId: e,
        })
    }

    return (<Row style={{marginTop:20, marginBottom:-10}}>
        <Col>
            机构：<Select defaultValue={0} style={{ width: 120 }} value={orgId} onChange={handleChangeOrg} >
            <Option value={0}>全部</Option>
            {orgs!=null && orgs != undefined && orgs.map((value =>
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
    </Row>);
}

export default OrderFilter;