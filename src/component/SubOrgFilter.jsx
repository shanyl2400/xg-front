import { Col, Row, Select, Cascader, message } from "antd";
import React, { useEffect, useState } from "react";
import options from './address';
import { listOrgsAPI } from '../api/api';

const { Option } = Select;
function SubOrgFilter(props) {
    const [address, setAddress] = useState([]);
    const [org, setOrg] = useState("");
    const [parentOrgs, setParentOrgs] = useState([]);
    useEffect(() => {
        const fetchData = async () => {

            let parentOrgsRes = await listOrgsAPI(0, 0);
            if (parentOrgsRes.err_msg == "success") {
                // setParentOrgs();
                let tmpOrgs = [];
                for(let i = 0; i < parentOrgsRes.data.orgs.length; i ++){
                    if(parentOrgsRes.data.orgs[i].id != 1){
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
            address: e[0] + e[1],
            parent_id: org,
        });
    }

    let changeOrg = async e => {
        setOrg(e);
        let addr = "";
        if(address.length > 1){
            addr = address[0] + address[1];
        }
        props.onFilterChange({
            address: addr,
            parent_id: e,
        });
    }

    return (
        <Row style={{ marginTop: 20, marginBottom: -10 }}>
            <Col>
                地址：
            </Col>
            <Col>
                <Cascader options={options} placeholder="请选择" value={address} onChange={changeAddressRegion} />
            </Col>
            <Col offset={1}>
                机构：
                </Col>
            <Col>
                <Select defaultValue={0} style={{ width: 140 }} value={org} onChange={changeOrg}>
                    <Option value={0} key={0}>所有机构</Option>
                    {parentOrgs != null && parentOrgs.map((v) =>
                        <Option value={v.id} key={v.id}>{v.name}</Option>
                    )}
                </Select>
            </Col>


        </Row>
    )
}
export default SubOrgFilter;