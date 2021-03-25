import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SubOrgDetailsModel from './SubOrgDetailsModel';
import TableSubOrgModel from './TableSubOrgModel';
import SubOrgEditModel from './SubOrgEditModel';

import { parseAddress } from "../utils/address";
let currentID = 100000000;
let searchInput;
function SubOrgInfoTable(props) {
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setTableSearchInfo({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[tableSearchInfo.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: '校区名',
            dataIndex: 'name',
            width: 120,
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            render: (text, v) => <span>{parseAddress(v.address.region)}{v.address.ext}</span>,
        },
        {
            title: '操作',
            dataIndex: 'id',
            width: 100,
            key: 'id',
            render: (text, v) => <span>
                <SearchOutlined style={{ fontSize: 14 }} onClick={() => clickDetails(v.id)} />
                {isEditMode() && (<span>
                    <EditOutlined style={{ fontSize: 14, marginLeft: 6 }} onClick={() => clickUpdate(v.id)} />
                    <DeleteOutlined style={{ fontSize: 14, marginLeft: 6, color: "#cf1322" }} onClick={() => clickDelete(v.id)} />
                </span>)}
            </span>,
        }
    ]
    let [detailsOrgID, setDetailsOrgID] = useState(-1);
    let [editOrgID, setEditOrgID] = useState(-1);
    let [detailsModelVisible, setDetailsModelVisible] = useState(false);
    let [modelCreateVisible, setCreateModelVisible] = useState(false);
    let [modelEditVisible, setEditModelVisible] = useState(false);
    let [orgs, setOrgs] = useState([]);
    let [tableSearchInfo, setTableSearchInfo] = useState({
        searchText: '',
        searchedColumn: '',
    });
    let [searchedColumn, setSearchedColumn] = useState("");

    const isEditMode = () => {
        if (props.editable == true) {
            return true;
        }
        return false;
    }
    const cancelDetailsMode = () => {
        setDetailsModelVisible(false);
    }
    const cancelEditMode = () => {
        setEditModelVisible(false);
    }
    const clickDetails = (id) => {
        setDetailsModelVisible(true);
        setDetailsOrgID(id);
    }
    const clickUpdate = (id) => {
        setEditModelVisible(true);
        setEditOrgID(id);
    }
    const clickDelete = (id) => {
        let newOrgs = [];
        for (let i = 0; i < orgs.length; i++) {
            if (orgs[i].id != id) {
                newOrgs.push(orgs[i]);
            }
        }
        setOrgs(newOrgs);
        updateSubOrgs(newOrgs);
    }

    const handleAddSubOrgModel = () => {
        setCreateModelVisible(true);
    }
    const handleCloseCreateModel = () => {
        setCreateModelVisible(false);
    }
    const handleUpdateSubOrg = (id, data) => {
        let newOrgs = [];
        for (let i = 0; i < orgs.length; i++) {
            if (orgs[i].id == id) {
                data.id = id;
                newOrgs.push(data);
            } else {
                newOrgs.push(orgs[i]);
            }
        }
        setOrgs(newOrgs);
        updateSubOrgs(newOrgs);
        setEditModelVisible(false);
    }
    const handleAddSubOrg = (data) => {
        let newOrgs = [];
        for (let i = 0; i < orgs.length; i++) {
            newOrgs.push(orgs[i]);
        }
        if (data.id == undefined) {
            data.id = currentID;
            currentID++;
        }
        newOrgs.push(data);
        setOrgs(newOrgs);
        updateSubOrgs(newOrgs);
        setCreateModelVisible(false);
    }

    const updateSubOrgs = (orgs) => {
        switch (props.mode) {
            case "form":
                let newOrgs = [];
                for (let i = 0; i < orgs.length; i++) {
                    newOrgs.push({
                        id: orgs[i].id,
                        name: orgs[i].name,
                        address: orgs[i].address.region,
                        address_ext: orgs[i].address.ext,
                        subjects: orgs[i].intentSubject,
                    })
                }
                console.log(newOrgs);
                props.onChange(newOrgs);
                break;
            case "state":
                props.updateSubOrgs(orgs);
                break;
        }
    }

    const parseOrgs = orgs => {
        let newOrgs = [];
        for (let i = 0; i < orgs.length; i++) {
            newOrgs.push({
                id: orgs[i].id,
                name: orgs[i].name,
                address: {
                    region: orgs[i].address,
                    ext: orgs[i].address_ext,
                },
                intentSubject: orgs[i].subjects,
            })
        }
        return newOrgs
    }
    useEffect(() => {
        if (props.value != null) {
            setOrgs(parseOrgs(props.value));
        }
    }, [props.value])

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

        setTableSearchInfo({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    const handleReset = clearFilters => {
        clearFilters();
        setTableSearchInfo({ searchText: '' });
    };
    return (
        <div style={{ width: "100%" }}>
            <Table pagination={{ position: 'bottom', pageSize: 5, size: "small" }} style={{ width: "100%" }} columns={columns} dataSource={orgs} />
            {isEditMode() && <Button onClick={handleAddSubOrgModel}>添加分校</Button>}
            <SubOrgDetailsModel data={orgs} id={detailsOrgID} visible={detailsModelVisible} closeModel={cancelDetailsMode} />
            <SubOrgEditModel
                data={orgs}
                id={editOrgID}
                visible={modelEditVisible}
                closeModel={cancelEditMode}
                submitForm={handleUpdateSubOrg} />
            <TableSubOrgModel visible={modelCreateVisible} closeModel={handleCloseCreateModel} submitForm={handleAddSubOrg} />
        </div>
    );
}
export default SubOrgInfoTable;
