import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import SubOrgDetailsModel from './SubOrgDetailsModel';
import TableSubOrgModel from './TableSubOrgModel';
import SubOrgEditModel from './SubOrgEditModel';

import { parseAddress } from "../utils/address";
let currentID = 100000000;
function SubOrgInfoTable(props) {
    const columns = [
        {
            title: '校区名',
            dataIndex: 'name',
            key: 'name',
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
            key: 'id',
            render: (text, v) => <span>
                <a onClick={() => clickDetails(v.id)} href="#">详情</a>
                {isEditMode() && (<span>
                    /<a onClick={() => clickUpdate(v.id)} href="#">修改</a>
                /<a onClick={() => clickDelete(v.id)} href="#">删除</a>
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
    console.log(props.value);

    return (

        <div>
            <Table columns={columns} dataSource={orgs} />
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
