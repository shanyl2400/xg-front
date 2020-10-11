import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import SubOrgItem from './SubOrgItem2';
function SubOrgInfo(props) {
    return (
        <div>
            <div style={{ padding: 0, marginLeft: 5, marginBottom: 10, listStyle: "none" }}>
                {props.orgs != null && props.orgs.map((v) =>
                        <Card key={v.id} title={v.name} style={{ width: 300, marginBottom: 20, float:"left" }}>
                            <p>地址：{v.address}{v.address_ext}</p>
                            课程：<ul>
                                {v.subjects.map((v) =>
                                    <li key={v}>
                                        {v}
                                    </li>
                                )}
                            </ul>
                        </Card>
                )}
            </div>
            <div style={{clear:"both"}}></div>
        </div>
    );
}
export default SubOrgInfo;
