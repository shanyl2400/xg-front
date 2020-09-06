import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import SubOrgModel from './SubOrgModel';
import SubOrgItem from './SubOrgItem';
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
        setModelVisible(false);
    }

    const handleRemoveSubOrg = (id) => {
        props.removeSubOrg(id);
    }
    return (
        <div>
            <div style={{padding: 0, marginLeft:5, marginBottom:10,listStyle:"none"}}>
            {props.subOrgs.map((v) =>
                    <div key={v.id}>
                    <SubOrgItem 
                        name={v.name} 
                        address={v.address} 
                        intentSubject={v.intentSubject}
                        delete={()=>handleRemoveSubOrg(v.id)}
                        hasDelete={true}
                    />
                    </div>
                    )}
            </div>
            <Button onClick={handleAddSubOrgModel}>添加分校</Button>
            <SubOrgModel visible={modelVisible} closeModel={handleCloseModel} submitForm={handleAddSubOrg}/>
        </div>
    );
}    
export default SubOrgForm;
