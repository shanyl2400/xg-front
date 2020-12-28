import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { parseAddress } from "../utils/address";
function SubOrgItemView(props) {
    let extra = "";
    if (props.hasDelete) {
        extra = <a onClick={props.delete}>删除</a>
    }
    return (

        <Card title={props.name} extra={extra} style={{ width: 300, marginBottom: 20 }}>
            <p>地址：{parseAddress(props.address)}</p>
            课程：<ul>
                {props.intentSubject.map((v, i) =>
                    <li key={i}>
                        {v}
                    </li>
                )}
            </ul>
        </Card>

    );
}
export default SubOrgItemView;
