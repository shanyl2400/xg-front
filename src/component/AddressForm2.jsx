import React, { useState } from 'react';
import { Cascader, Input, Row, Col } from 'antd';
import options from '../component/address';

function AddressForm(props) {
    const changeAddressRegion = e => {
        let address = "";
        for (let i = 0; i < e.length; i++) {
            address = address + e[i];
        }
        props.onChange({
            region: address,
            ext: props.value.ext
        });
    }
    const changeAddressExt = e => {
        let curExt = e.target.value;
        props.onChange({
            region: props.value.region,
            ext: curExt
        });
    }

    const getRegion = () =>{
        let region = [];
        if(props.value.region != null){
            region = props.value.region.split("市");
        }
        return region
    }

    return (
        <Row>
            <Col span={10}>
                <Cascader options={options} value={getRegion()} placeholder="请选择" onChange={changeAddressRegion} />
            </Col>
            <Col offset={1} span={12}>
                <Input placeholder="请输入详细地址" value={props.value.ext} onChange={changeAddressExt} />
            </Col>
        </Row>
    )
}
export default AddressForm;
