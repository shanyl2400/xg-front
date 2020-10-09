import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import SubOrgModel from './SubOrgModel2';
import UpdateSubOrgModel from './UpdateSubOrgModel';
import SubOrgItem from './SubOrgItem2';
function SubOrgForm(props) {
    let [modelVisible, setModelVisible] = useState(false);
    let [updateModelVisible, setUpdateModelVisible] = useState(false);
    let [updateModelData, setUpdateModelData] = useState(null);
    let [subjects, setSubjects] = useState([]);

    //获取课程信息
    async function getSubjects() {
        let subjects = [];
        if (subjects.length < 1) {
            let rawSubjects = await listSubjects();
            for (let i = 0; i < rawSubjects.length; i++) {
                if (rawSubjects[i].level == 1) {
                    subjects = subjects.concat({
                        id: rawSubjects[i].id,
                        parent_id: rawSubjects[i].parent_id,
                        level: rawSubjects[i].level,
                        name: rawSubjects[i].name,
                        children: []
                    })
                }
            }

            for (let i = 0; i < rawSubjects.length; i++) {
                if (rawSubjects[i].level == 2) {
                    for (let j = 0; j < subjects.length; j++) {
                        if (rawSubjects[i].parent_id == subjects[j].id) {
                            subjects[j].children = subjects[j].children.concat({
                                id: rawSubjects[i].id,
                                parent_id: rawSubjects[i].parent_id,
                                level: rawSubjects[i].level,
                                name: rawSubjects[i].name,
                            })
                        }
                    }
                }
            }
        }
        return subjects
    }

    useEffect(() => {
        const fetchData = async () => {
            const sub = await getSubjects();
            setSubjects(sub);
        }
        fetchData();
    }, [])
    const handleAddSubOrgModel = (e) => {
        setModelVisible(true);
    }
    const handleCloseModel = (e) => {
        setModelVisible(false);
    }

    const handleUpdateSubOrgModel = (data) => {
        setUpdateModelData(data);
        setUpdateModelVisible(true);
    }
    const handleCloseUpdateModel = (e) => {
        setUpdateModelVisible(false);
    }

    const handleUpdateSubOrg = (id, data) => {
        props.updateSubOrg(id, data)
        setUpdateModelVisible(false);
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
            <div style={{ padding: 0, marginLeft: 5, marginBottom: 10, listStyle: "none" }}>
                {props.value.map((v) =>
                    <div key={v.id}>
                        <SubOrgItem
                            name={v.name}
                            address={v.address}
                            intentSubject={v.intentSubject}
                            delete={() => handleRemoveSubOrg(v.id)}
                            handelUpdate={() => handleUpdateSubOrgModel(v)}
                            hasDelete={true}
                        />
                    </div>
                )}
            </div>
            <Button onClick={handleAddSubOrgModel}>添加分校</Button>
            <SubOrgModel subjects={subjects} visible={modelVisible} closeModel={handleCloseModel} submitForm={handleAddSubOrg} />
            <UpdateSubOrgModel subjects={subjects} value={updateModelData} visible={updateModelVisible} closeModel={handleCloseUpdateModel} submitForm={handleUpdateSubOrg} />
        </div>
    );
}
export default SubOrgForm;
