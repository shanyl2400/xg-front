import {Col, Row, Select} from "antd";
import React, {useEffect, useState, message} from "react";
import { listSubjectsAPI } from "../api/api";

const { Option } = Select;
function SubjectsSelector(props){
    const [items, setItems] = useState([]);
    const [values, setValues] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const res = await listSubjectsAPI();
            if (res.err_msg == "success") {
                let tempSubjects = res.subjects
                var m = new Map(); 
                let resSubjects = [];
                for(let i = 0; i < tempSubjects.length; i ++){
                    if(tempSubjects[i].parent_id == 0){
                        m.set(tempSubjects[i].id, tempSubjects[i]); 
                    }            
                }
                for(let i = 0; i < tempSubjects.length; i ++) {
                    if(tempSubjects[i].parent_id != 0) {
                        let parentValue = m.get(tempSubjects[i].parent_id)
                        resSubjects = resSubjects.concat({
                            id: tempSubjects[i].id,
                            name: parentValue.name + "-" + tempSubjects[i].name
                        });
                    }
                }
                let children = [];
                for (let i = 0; i < resSubjects.length; i++) {
                    children.push(<Option key={resSubjects[i].id}>{resSubjects[i].name}</Option>);
                }
                setItems(children);
            } else {
                message.warn("无法获取课程信息");
            }
        }

        fetchData();
    }, [])
    let changeValue = async e => {
        console.log(e)
    }
   
    return(
            <span>
                <Select
                mode="multiple"
                allowClear
                style={{ minWidth: 180, maxWidth: 600 }}
                placeholder="请选择科目"
                values={values}
                defaultValue={props.defaultValue}
                onChange={changeValue}
                >
                {items}
                </Select>
            </span>
    )
}
export default SubjectsSelector;