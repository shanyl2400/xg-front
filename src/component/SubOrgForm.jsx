import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import SubOrgModel from './SubOrgModel';
import SubOrgInfoTable from './SubOrgInfoTable';
function SubOrgForm(props) {
    let [modelVisible, setModelVisible] = useState(false);
    const handleAddSubOrgModel = (e) => {
        setModelVisible(true);
    }
    const handleCloseModel = (e) => {
        setModelVisible(false);
    }

    const handleAddSubOrg = (data) => {
        props.addSubOrg(data);
        console.log(data);
        setModelVisible(false);
    }

    const handleRemoveSubOrg = (id) => {
        props.removeSubOrg(id);
    }
    return (
        <div>
            <div style={{ padding: 0, marginLeft: 5, marginBottom: 10, listStyle: "none" }}>
                <SubOrgInfoTable data={props.subOrgs} />
            </div>
            <Button onClick={handleAddSubOrgModel}>添加分校</Button>
            <SubOrgModel visible={modelVisible} closeModel={handleCloseModel} submitForm={handleAddSubOrg} />
        </div>
    );
}
export default SubOrgForm;
