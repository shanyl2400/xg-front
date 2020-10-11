import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import SubOrgModel from './SubOrgModel2';
import UpdateSubOrgModel from './UpdateSubOrgModel';
import SubOrgItem from './SubOrgItem2';
import {listSubjects} from '../api/api';
let baseId = 100000000;
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
        let nameParts = data.name.split("-");
        data.name = nameParts[nameParts.length - 1];
        data.addressData={
            region: data.address,
            ext: data.address_ext
        };
        data.intentSubject = getIntentSubjects(data.subjects);

        setUpdateModelData(data);
        setUpdateModelVisible(true);
    }
    const handleCloseUpdateModel = (e) => {
        setUpdateModelVisible(false);
    }

    const handleUpdateSubOrg = (id, data) => {
        let tmpOrgs = [];
        for (let i = 0; i < props.value.length; i++) {
            let v = props.value[i];
            if (props.value[i].id == id) {
                v.name = data.name;
                v.address = data.addressData.region;
                v.address_ext = data.addressData.ext;
                v.addressData = data.addressData;
                v.intentSubject = data.intentSubject;
                v.subjects = [];
                for(let x = 0; x < data.intentSubject.length; x ++){
                    v.subjects.push(data.intentSubject[x].value);
                }
            } 
            tmpOrgs.push(v);
        }
        props.onChange(tmpOrgs);
        setUpdateModelVisible(false);
    }

    const handleAddSubOrg = (data) => {
        data.id = baseId;
        baseId++;

        let tmpOrgs = [];
        for (let i = 0; i < props.value.length; i++) {
            let v = props.value[i];
            tmpOrgs.push(v);
        }
        tmpOrgs.push(data);
        console.log(tmpOrgs);
        props.onChange(tmpOrgs);
        setModelVisible(false);
    }

    const handleRemoveSubOrg = (id) => {
        let tmpOrgs = [];
        for (let i = 0; i < props.value.length; i++) {
            if (props.value[i].id == id) {
                continue;
            } else {
                tmpOrgs.push(props.value[i]);
            }
        }
        props.onChange(tmpOrgs);
    }
    const getIntentSubjects = (subjects) => {
        if(subjects == null){
            return [];
        }
        let ret = [];
        for(let i = 0; i < subjects.length; i ++){
                ret.push({id: i + 1, name: subjects[i], value: subjects[i]});
        }
        return ret;
    }
    return (
        <div>
            <div style={{ padding: 0, marginLeft: 5, marginBottom: 10, listStyle: "none" }}>
                {props.value != null && props.value.map((v) =>
                    <div key={v.id}>
                        <SubOrgItem
                            name={v.name}
                            addressData={{region: v.address, ext: v.address_ext}}
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
