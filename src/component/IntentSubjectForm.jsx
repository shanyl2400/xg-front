import React, { useState } from 'react';
import { Button } from 'antd';
import IntentSubjectFormItem from './IntentSubjectFormItem';

function IntentSubjectForm(props) {
    let handleDeleteItem = id=>{
        let intentSubject = props.value;
        let newIntentSubject = [];
        for(let i = 0; i < intentSubject.length; i ++){
            if(id == intentSubject[i].id){
                continue;
            }
            newIntentSubject.push(intentSubject[i]);
        }
        props.onChange(newIntentSubject);
    }
    let handleUpdateItem = (id, value) =>{
        let intentSubject = props.value;
        let newIntentSubject = [];
        for(let i = 0; i < intentSubject.length; i ++){
            if(id == intentSubject[i].id){
                newIntentSubject.push({
                    id: i,
                    value: value,
                });
                continue;
            }
            newIntentSubject.push(intentSubject[i]);
        }
        props.onChange(newIntentSubject);
    }
    let handleAddItem = ()=>{
        let intentSubject = props.value;
        let newIntentSubject = [];
        let max = 0;
        for(let i = 0; i < intentSubject.length; i ++){
            newIntentSubject.push(intentSubject[i]);
            if(max < i){
                max = i;
            }
        }
        max = max + 1;
        newIntentSubject.push({
            id: max,
            value: "请选择-请选择-普通课"
        });
        props.onChange(newIntentSubject);
    }
    return (
        <div>
            <div className="intent-subject-body" style={{border:"1px solid #ccc", height:"100px",overflowY:"auto"}}>
                {props.value!= null && props.value.map((v) =>
                    <li key={v.id}>
                        <IntentSubjectFormItem 
                            subjects={props.subjects}
                            value={v.value} 
                            id={v.id} 
                            deleteItem={(id)=>{handleDeleteItem(id)}}
                            updateItem={(e)=>{handleUpdateItem(v.id, e)}}
                        />
                    </li>
                    )}
            </div>
            <Button onClick={()=>handleAddItem()} style={{marginTop:"10px"}} htmlType="button">
                添加意向
            </Button>
        </div>
    )
}
export default IntentSubjectForm;
