import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { parseAddress } from "../utils/address";
function SubOrgItem(props) {
    let extra = "";
    if (props.hasDelete) {
        extra = <span>
            <a onClick={props.handelUpdate}>修改</a> /
            <a onClick={props.delete}>删除</a>
        </span>
    }
    return (

        <Card title={props.name} extra={extra} style={{ width: 300, marginBottom: 20 }}>
            <p>地址：{parseAddress(props.addressData.region)}{props.addressData.ext}</p>
            课程：<ul>
                {props.intentSubject.map((v) =>
                    <li key={v.id}>
                        {v.value}
                    </li>
                )}
            </ul>
        </Card>

    );
}
export default SubOrgItem;
