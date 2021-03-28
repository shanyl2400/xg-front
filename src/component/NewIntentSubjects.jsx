import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';

function NewIntentSubjects(props) {

    const onChange = value => {
        console.log('onChange ', value);
        props.onChange(value);
    };
    const getValue = (value) => {
        if (value != null && props.subjectsAll != null) {
            let initValue = [];
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < props.subjectsAll.length; j++) {
                    if (props.subjectsAll[j].value == value[i]) {
                        initValue.push(props.subjectsAll[j])
                    }
                }
            }
            return value;
            // return initValue;
        }
    }
    const tProps = {
        treeData: props.subjects,
        value: getValue(props.value),
        onChange: onChange,
        treeCheckable: true,
        multiple: true,
        showCheckedStrategy: TreeSelect.SHOW_CHILD,
        placeholder: '请选择报名意向',
        maxTagCount: 10,
        style: {
            width: '100%',
        },
    };

    return (
        <div>
            <TreeSelect {...tProps} />
        </div>
    )
}
export default NewIntentSubjects;