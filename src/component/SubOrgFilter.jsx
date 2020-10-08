import {Col, Row, Select, Cascader, message} from "antd";
import React, {useEffect, useState} from "react";
import options from './address';
import SubjectsSelector from './SubjectsSelector';

const { Option } = Select;
function SubOrgFilter(props){
    const [address, setAddress] = useState("");

    let changeAddressRegion = async e => {
        setAddress(e);
        if(e.length < 2){
           props.onFilterChange("");
           return;
        }
        props.onFilterChange(e[0] + e[1]);
    }

    return(
        <Row style={{marginTop:20, marginBottom:-10}}>
            <Col>
                地址：
                <Cascader options={options} placeholder="请选择" value={address} onChange={changeAddressRegion}/>
            </Col>

            {/* <Col offset={1}>
                科目：<SubjectsSelector defaultValue={props.defaultSubjects}/>
            </Col> */}
        </Row>
    )
}
export default SubOrgFilter;