import React, { useState } from 'react';
import { Cascader, Input } from 'antd';

// const options = [
//   {
//     value: '设计',
//     label: '设计',
//     children: [
//       {
//         value: 'Photoshop',
//         label: 'Photoshop',
//       },
//     ],
//   },
//   {
//     value: '语言',
//     label: '语言',
//     children: [
//       {
//         value: '英语',
//         label: '英语',
//       },
//     ],
//   },
// ];

function buildOptions(props){
  let options = []
  for(let i = 0; i < props.subjects.length; i ++){
    let option = {
      value: props.subjects[i].name,
      label: props.subjects[i].name,
      children: [],
    }
    for(let j = 0; j < props.subjects[i].children.length; j ++) {
        option.children.push({
          value: props.subjects[i].children[j].name,
          label: props.subjects[i].children[j].name,
        })
    }
    if(option.children.length > 0){
      options.push(option);
    }
  }
  return options;
}

function IntentSubjectFormItem(props) {

  let handleDelete = () => {
    props.deleteItem(props.id);
  }
  let handleUpdate = (e, controller) => {
    if (controller == 1) {
      let values = props.value.split("-");
      e = e.concat(values[2]);
    } else {
      let values = props.value.split("-");
      e = [values[0], values[1], e]
    }
    props.updateItem(e[0] + "-" + e[1] + "-" + e[2]);
  }

  let options = buildOptions(props);
  let values = props.value.split("-");
  let cascaderValues = [values[0], values[1]];
  return (
    <div style={{ width: 420 }}>
      <Cascader allowClear={false} onChange={e => handleUpdate(e, 1)} value={cascaderValues} options={options} placeholder="请选择报名意向" style={{ width: 200, margin: "8px 8px" }} />
      <Input onChange={e => handleUpdate(e.target.value, 2)} value={values[2]} style={{ width: "100px" }} />
      <a onClick={() => handleDelete()} style={{ marginLeft: "8px" }} href="#">删除</a>
    </div>
  )
}
export default IntentSubjectFormItem;