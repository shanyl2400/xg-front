import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { parseAddress } from "../utils/address";
function SubOrgItem(props) {
    let extra = "";
    if (props.hasDelete) {
        extra = <a onClick={props.delete}>删除</a>
    }
    return (

        <Card title={props.name} extra={extra} style={{ width: 300, marginBottom: 20 }}>
            <p>地址：{parseAddress(props.address.region)}{props.address.ext}</p>
            课程：<ul>
                {props.intentSubject.map((v) =>
                    <li key={v}>
                        {v}
                    </li>
                )}
            </ul>
        </Card>

    );
}
export default SubOrgItem;
