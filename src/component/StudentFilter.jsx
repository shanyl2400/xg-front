import {Col, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import {listOrgsAPI} from "../api/api";

const { Option } = Select;
function StudentFilter(props){
    const [status, setStatus] = useState(0);

    let handleChangeStatus = async e => {
        setStatus(e);
        props.onFilterChange(e);
    }

    return(
        <Row style={{marginTop:20, marginBottom:-10}}>
            <Col>
                状态：<Select defaultValue={0} value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                <Option value={0}>全部</Option>
                <Option value={1}>已创建</Option>
                <Option value={3}>冲单成功</Option>
                <Option value={2}>冲单失败</Option>
            </Select>
            </Col>
        </Row>
    )
}
export default StudentFilter;