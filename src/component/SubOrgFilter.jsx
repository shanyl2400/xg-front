import { Col, Row, Select, Cascader, message, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import options from './address';
import { listOrgsAPI } from '../api/api';

const { Search } = Input;
const { Option } = Select;
function SubOrgFilter(props) {
    const [address, setAddress] = useState([]);
    const [org, setOrg] = useState("");
    const [isFilter, setIsFilter] = useState(true);
    const [parentOrgs, setParentOrgs] = useState([]);
    const [query, setQuery] = useState("")
    useEffect(() => {
        const fetchData = async () => {

            let parentOrgsRes = await listOrgsAPI(0, 0);
            if (parentOrgsRes.err_msg == "success") {
                // setParentOrgs();
                let tmpOrgs = [];
                for (let i = 0; i < parentOrgsRes.data.orgs.length; i++) {
                    if (parentOrgsRes.data.orgs[i].id != 1) {
                        tmpOrgs.push(parentOrgsRes.data.orgs[i])
                    }
                }
                setParentOrgs(tmpOrgs);
            } else {
                message.warn("查不到机构选项");
            }
        }

        fetchData();
    }, [])
    let changeAddressRegion = async e => {
        setAddress(e);
        if (e.length < 2) {
            props.onFilterChange("");
            return;
        }
        props.onFilterChange({
            address: e[0] + "-" + e[1],
            parent_id: org,
            isFilter: isFilter,
            name: query,
        });
    }

    let changeOrg = async e => {
        setOrg(e);
        let addr = "";
        if (address.length > 1) {
            addr = address[0] + address[1];
        }
        props.onFilterChange({
            address: addr,
            parent_id: e,
            isFilter: isFilter,
            name: query,
        });
    }

    let changeFilter = async e => {
        setIsFilter(e);
        let addr = "";
        if (address.length > 1) {
            addr = address[0] + address[1];
        }
        props.onFilterChange({
            address: addr,
            parent_id: org,
            isFilter: e,
            name: query,
        });
    }
    let changeOrgName = e => {
        let addr = "";
        if (address.length > 1) {
            addr = address[0] + address[1];
        }
        props.onFilterChange({
            address: addr,
            parent_id: org,
            isFilter: isFilter,
            name: e,
        });
    }

    return (
        <Row style={{ marginTop: 20, marginBottom: -10 }}>
            <Col>
                地址：
                <Cascader options={options} placeholder="请选择" value={address} onChange={changeAddressRegion} />
            </Col>
            <Col offset={1}>
                机构：
                <Select defaultValue={0} style={{ width: 140 }} value={org} onChange={changeOrg}>
                    <Option value={0} key={0}>所有机构</Option>
                    {parentOrgs != null && parentOrgs.map((v) =>
                        <Option value={v.id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
            </Col>
            <Col offset={1}>
                过滤专业：
                <Select defaultValue={true} style={{ width: 60 }} value={isFilter} onChange={changeFilter}>
                    <Option value={true} key={true}>是</Option>
                    <Option value={false} key={false}>否</Option>
                </Select>
            </Col>
            <Col offset={1}>
                机构名：
            </Col>
            <Col>
                <Search placeholder="请输入机构名" onSearch={changeOrgName} value={query} onChange={e => setQuery(e.target.value)} />
            </Col>

        </Row>
    )
}
export default SubOrgFilter;