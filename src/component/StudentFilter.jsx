import { Col, Row, Select, Input } from "antd";
import React, { useEffect, useState } from "react";
import { listOrgsAPI } from "../api/api";

const { Option } = Select;
const { Search } = Input;
function StudentFilter(props) {
    const [status, setStatus] = useState(props.status);
    console.log(props.status);
    const [isDispatched, setIsDispatched] = useState(props.isDispatched);
    const [keywords, setKeywords] = useState("");

    let handleChangeStatus = async e => {
        setStatus(e);
        props.onFilterChange({
            status: e,
            noDispatch: isDispatched,
            keywords: keywords,
        });
    }

    let handleChangeIsDispatch = async e => {
        setIsDispatched(e);
        props.onFilterChange({
            status: status,
            noDispatch: e,
            keywords: keywords,
        });
    }
    const handleChangeSearch = e => {
        props.onFilterChange({
            status: status,
            noDispatch: isDispatched,
            keywords: e,
        });
    }

    return (
        <Row style={{ marginTop: 20, marginBottom: -10 }}>
            <Col>
                状态：<Select mode="multiple" value={status} style={{ width: 120 }} onChange={handleChangeStatus}>
                    {/* <Option value={0}>全部</Option> */}
                    <Option value={1}>已创建</Option>
                    <Option value={3}>冲单成功</Option>
                    <Option value={2}>冲单失败</Option>
                </Select>
            </Col>
            <Col offset={1}>
                类型：<Select defaultValue={false} value={isDispatched} style={{ width: 120 }} onChange={handleChangeIsDispatch}>
                    <Option value={false}>所有名单</Option>
                    <Option value={true}>未派名单</Option>
                </Select>
            </Col>

            <Col offset={1}>
                搜索： <Search
                    placeholder="请输入搜索内容"
                    onSearch={value => handleChangeSearch(value)}
                    style={{ width: 200 }}
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                />
            </Col>
        </Row>
    )
}
export default StudentFilter;