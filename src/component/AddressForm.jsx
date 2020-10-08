import React, { useState } from 'react';
import { Cascader, Input, Row, Col } from 'antd';
import options from '../component/address';

let curRegion = "";
let curExt = "";
function AddressForm(props) {
    const [region, setRegion] = useState(0);
    const [ext, setExt] = useState("");

    const changeAddressRegion = e => {
        setRegion(e);
        let address = "";
        for (let i = 0; i < e.length; i++) {
            address = address + e[i];
        }
        curRegion = address;
        props.onChange({
            region: address,
            ext: curExt    
        });
    }
    const changeAddressExt = e => {
        setExt(e.target.value);
        curExt = e.target.value;
        props.onChange({
            region: curRegion,
            ext: curExt    
        });
    }
    return (
        <Row>
        <Col span={10}>
        <Cascader options={options} placeholder="请选择" value={region} onChange={changeAddressRegion}/>
        </Col>
            <Col offset={1} span={12}>
            <Input placeholder="请输入详细地址" value={ext} onChange={changeAddressExt}/>
            </Col>
        </Row>
    )
}
export default AddressForm;
