import React, { useState } from 'react';
import { Cascader, Input, Row, Col } from 'antd';
import options from '../component/address';

function SubOrgEditModelAddress(props) {
    const changeAddressRegion = e => {
        let address = "";
        for (let i = 0; i < e.length; i++) {
            if (address != "") {
                address = address + "-";
            }
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

    let regions = [];
    if (props.value != null) {
        regions = props.value.region.split("-");
    }

    return (
        <Row>
            <Col span={10}>
                <Cascader options={options} value={regions} placeholder="请选择" onChange={changeAddressRegion} />
            </Col>
            <Col offset={1} span={12}>
                <Input placeholder="请输入详细地址" value={props.value != null ? props.value.ext : ""} onChange={changeAddressExt} />
            </Col>
        </Row>
    )
}
export default SubOrgEditModelAddress;
