import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, Col, Input, Button, Row, Select, message} from 'antd';
import { listSubjectsAPI, createSubjectAPI } from '../api/api';
const data = [
  {
    "id":1,
    "subject_name":"语言",
    "sub_subject_name":"英语"
  },
  {
    "id":2,
    "subject_name":"语言",
    "sub_subject_name":"日语"
  },
  {
    "id":3,
    "subject_name":"语言",
    "sub_subject_name":"葡萄牙语"
  },
  {
    "id":4,
    "subject_name":"计算机",
    "sub_subject_name":"办公"
  }
];
const { Option } = Select;
function SubjectList(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '课程名',
      dataIndex: 'parent_name',
      key: 'parent_name',
    },
    {
      title: '子课程名',
      dataIndex: 'name',
      key: 'name',
    }
  ];
  let [subjects, setSubjects] = useState({
    subjects: [],
    classify: [],
  });

  let [subjectName, setSubjectName] = useState("")
  let [subjectClassify, setSubjectClassify] = useState(0)

  const fetchData = async () => {
    let res = await listSubjectsAPI();
    if(res.err_msg == "success") {
      let tmpSubjects = [];
      let tmpClassify = [];
      for(let i = 0; i < res.subjects.length; i ++){
        let tmp = res.subjects[i];
        if(tmp.parent_id != 0){
          let parentName = "无";
          if(tmp.parent != null){
            parentName = tmp.parent.name;
          }
          tmpSubjects.push({
            id: tmp.id,
            key: tmp.id,
            name: tmp.name,
            parent_name: parentName,
          })
        }else{
          tmpClassify.push({
            id: tmp.id,
            key: tmp.id,
            name: tmp.name,
          })
        }
      }
      setSubjects({
        subjects: tmpSubjects,
        classify: tmpClassify,
      });
    }else {
      message.warning("获取机构列表失败：" + res.err_msg);
      return;
    }
  }
  const handleUpdateSubjectName = (e) => {
    setSubjectName(e.target.value)
  }
  const handleUpdateSubjectClassify = (e) => {
    setSubjectClassify(e)
  }
  const handleAddSubject = async ()=>{
    if(subjectName.trim() == "") {
      message.warn("课程名不能为空");
      return;
    }
    let res = await createSubjectAPI({
      "name": subjectName,
      "parent_id": subjectClassify,
    })
    console.log(res)
    if(res.err_msg == "success"){
      message.success("添加成功");
      setSubjectName("");
      setSubjectClassify(1);
      fetchData();
    }else{
      message.error("添加失败," + res.err_msg);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单列表</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
      <Col className="gutter-row" span={10}>
        <Table
          pagination={false}
          style={{ marginTop: "30px" }}
          columns={columns}
          dataSource={subjects.subjects}
          />

      </Col>
      </Row>
     
     <Row style={{ marginTop:"20px" }}>
      <Col className="gutter-row" span={20}>
        
     <Row>
        <Col className="gutter-row" span={2}>
          课程名：
        </Col>
        <Col className="gutter-row" span={4}>
        <Select defaultValue={0} style={{ width: 120 }} value={subjectClassify} onSelect={handleUpdateSubjectClassify}>
          <Option value={0}>无</Option>
          {subjects.classify.map((v) =>
              <Option value={v.id}>{v.name}</Option>
          )}
        </Select>
        </Col>
        <Col className="gutter-row" span={4}>
          <Input placeholder="请填写课程名" value={subjectName} onChange={handleUpdateSubjectName}/>
        </Col>
        <Col style={{ marginLeft:"20px" }} className="gutter-row" span={2}>
          <Button onClick={handleAddSubject} type="primary">添加</Button>
        </Col>
     </Row>
        
      </Col>
     </Row>
     
    
    </div>
  );
}

export default SubjectList;
