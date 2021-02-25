import { Col, Space, message, Input, Select } from "antd";
import React, { useState, useEffect } from 'react';
import { listRolesAPI, listOrgsAPI } from "../api/api";

const { Search } = Input;
const { Option } = Select;
function UserFilter(props) {
    const [roles, setRoles] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [name, setName] = useState("");
    const [filterRole, setFilterRole] = useState(0);
    const [filterOrg, setFilterOrg] = useState(0);
    const handleSubmitQuery = e => {
        props.onChangeFilter({
            name: name,
            role: filterRole,
            org: filterOrg,
        });
    }
    const handleChangeQuery = e => {
        setName(e.target.value);
    }
    const handleChangeRoles = e => {
        setFilterRole(e);
        props.onChangeFilter({
            query: name,
            org: filterOrg,
            role: e,
        });
    }
    const handleChangeOrgs = e => {
        setFilterOrg(e);
        props.onChangeFilter({
            query: name,
            org: e,
            role: filterRole,
        });
    }

    const fetchRoles = async () => {
        let res = await listRolesAPI();
        if (res.err_msg != "success") {
            message.error("无法获取角色列表");
            return;
        }
        setRoles(res.roles);

        let res2 = await listOrgsAPI();
        if (res2.err_msg != "success") {
            message.error("无法获取机构列表");
            return;
        }
        setOrgs(res2.data.orgs);
    }
    useEffect(() => {
        fetchRoles();
    }, []);
    return (
        <div>
            <Space size={[10, 5]} style={{ marginTop: 20, marginBottom: -10 }} wrap>
                <Col>
                    角色：<Select defaultValue={0} style={{ width: 120 }} value={filterRole} onChange={handleChangeRoles} >
                        <Option value={0}>全部</Option>
                        {roles != null && roles.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    机构：<Select defaultValue={0} style={{ width: 120 }} value={filterOrg} onChange={handleChangeOrgs} >
                        <Option value={0}>全部</Option>
                        {orgs != null && orgs.map((value =>
                            <Option key={value.id} value={value.id}>{value.name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    搜索： <Search
                        placeholder="请输入用户名"
                        onChange={handleChangeQuery}
                        onSearch={value => handleSubmitQuery(value)}
                        style={{ width: 200 }}
                        value={name}
                    />
                </Col>
            </Space>

        </div>
    );
}

export default UserFilter;