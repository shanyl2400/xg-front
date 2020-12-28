import React, { useState, useEffect } from 'react';
import { Breadcrumb, Typography, Col, Input, Button, Row, Select, message, Tree, Modal, Space } from 'antd';
import { listSubjectsTreeAPIWithData, createSubjectAPI, batchCreateSubjectAPI } from '../api/api';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;
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
  let [batchSubjectsValue, setBatchSubjectsValue] = useState("")
  let [subjectClassify, setSubjectClassify] = useState(0)
  let [batchAddSubjectClassify, setBatchAddSubjectClassify] = useState(0)
  let [batchAddModalVisible, setBatchAddModalVisible] = useState(false);

  const fetchData = async () => {
    let res = await listSubjectsTreeAPIWithData();
    if (res.err_msg == "success") {
      let tmpSubjects = [];
      let tmpClassify = [];
      for (let i = 0; i < res.subjects.length; i++) {
        let tmp = res.subjects[i];
        tmpSubjects.push(tmp);
        tmpClassify.push({ id: tmp.id, name: tmp.name });
      }
      console.log(tmpSubjects);
      console.log(tmpClassify);
      setSubjects({
        subjects: tmpSubjects,
        classify: tmpClassify,
      });
    } else {
      console.log(res);
      message.warning("获取机构列表失败：" + res.err_msg);
      return;
    }
  }
  const handleUpdateSubjectName = (e) => {
    setSubjectName(e.target.value)
  }
  const handleChangeBatchSubjectsValue = (e) => {
    setBatchSubjectsValue(e.target.value);
  }
  const handleUpdateSubjectClassify = (e) => {
    setSubjectClassify(e)
  }
  const handleBatchAddSubjectClassify = (e) => {
    setBatchAddSubjectClassify(e)
  }
  const handleAddSubject = async () => {
    if (subjectName.trim() == "") {
      message.warn("课程名不能为空");
      return;
    }
    let res = await createSubjectAPI({
      "name": subjectName,
      "parent_id": subjectClassify,
    })
    if (res.err_msg == "success") {
      message.success("添加成功");
      setSubjectName("");
      setSubjectClassify(1);
      fetchData();
    } else {
      message.error("添加失败," + res.err_msg);
    }
  }

  const handleBatchAddSubjects = async () => {
    setBatchAddModalVisible(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const handleCloseBatchAddModal = () => {
    setBatchAddModalVisible(false);
  }
  const handleSubmitBatchAddModal = async () => {
    let subjects = batchSubjectsValue.split("\n");
    let data = [];
    for (let i = 0; i < subjects.length; i++) {
      data.push({
        parent_id: batchAddSubjectClassify,
        name: subjects[i]
      });
    }
    let res = await batchCreateSubjectAPI({
      "data": data,
    })
    if (res.err_msg == "success") {
      message.success("添加成功");
      setBatchSubjectsValue("");
      setBatchAddSubjectClassify(0);
      fetchData();
    } else {
      message.error("添加失败," + res.err_msg);
    }
    setBatchAddModalVisible(false);
  }
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
      <Breadcrumb>
        <Breadcrumb.Item>课程管理</Breadcrumb.Item>
        <Breadcrumb.Item>课程列表</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={4} style={{ marginTop: 20, marginBottom: 20 }}>课程列表</Title>
      <Row>
        <Col className="gutter-row" span={10}>

          <Tree
            showLine={true}
            showIcon={true}
            onSelect={onSelect}
            treeData={subjects.subjects}
          />

        </Col>
      </Row>

      <Row style={{ marginTop: "20px" }}>
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
              <Input placeholder="请填写课程名" value={subjectName} onChange={handleUpdateSubjectName} />
            </Col>
            <Col style={{ marginLeft: "20px" }} className="gutter-row" span={6}>
              <Button onClick={handleAddSubject} shape="circle" type="primary">+</Button>
              <Button onClick={handleBatchAddSubjects} type="primary" style={{ marginLeft: 10 }}>批量加入</Button>
            </Col>
          </Row>

        </Col>
      </Row>

      <Modal title="批量加入对话框" visible={batchAddModalVisible} onOk={handleSubmitBatchAddModal} onCancel={handleCloseBatchAddModal}>

        <Space direction="vertical" >
          <Col className="gutter-row" span={26}>
            课程名：
            <TextArea
              placeholder="请输入科目名称，不同学科用“回车”隔开"
              autoSize={{ minRows: 3, maxRows: 5 }}
              value={batchSubjectsValue}
              onChange={handleChangeBatchSubjectsValue}
            />
          </Col>
          <Col className="gutter-row" span={10}>
            分类：
            <Select defaultValue={0} style={{ width: 120 }} value={batchAddSubjectClassify} onSelect={handleBatchAddSubjectClassify}>
              <Option value={0}>无</Option>
              {subjects.classify.map((v) =>
                <Option value={v.id}>{v.name}</Option>
              )}
            </Select>
          </Col>
        </Space>
      </Modal>

    </div>
  );
}

export default SubjectList;
