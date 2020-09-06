import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
function SubOrgItem(props) {
    let extra = "";
    if(props.hasDelete){
        extra = <a onClick={props.delete}>删除</a>
    }
    return (

        <Card title={props.name} extra={extra} style={{ width: 300, marginBottom:20}}>
            <p>地址：{props.address}</p>
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
