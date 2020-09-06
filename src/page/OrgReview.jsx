import React, { useState, useEffect } from 'react';
import { Breadcrumb, message, Space, Table } from 'antd';
import { useHistory } from "react-router-dom";
import ReviewOrgModel from '../component/ReviewOrgModel';
import { listPendingOrgsAPI, getOrgAPI } from '../api/api';
import { getOrgStatus } from '../utils/status';

function OrgReview(props) {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    // {
    //   title: '推荐科目',
    //   dataIndex: 'subjects',
    //   key: 'subjects',
    // },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {getOrgStatus(status)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
        <a onClick={()=>{history.push("/main/org_details/"+record.id)}}>详情</a>
          <a onClick={()=>{handleReview(record.id)}}>审批</a>
        </Space>
      ),
    },
  ];
  let history = useHistory();
  let [reviewOrgModelVisible, setReviewOrgModelVisible] = useState(false);
  let [orgData, setOrgData] = useState({});
  let [orgList, setOrgList] = useState([]);

  const handleReview = async (id) => {
    let res = await getOrgAPI(id);
    if(res.err_msg == "success") {
        let org = res.org;
        setOrgData(org);
        setReviewOrgModelVisible(true);
    }else {
      message.warning("获取机构信息失败：" + res.err_msg);
      return;
    }
  }
 
  const fetchData = async () => {
    let res = await listPendingOrgsAPI();
    if(res.err_msg == "success") {
      let tempOrgs = [];
      for(let i = 0; i < res.data.orgs.length; i ++){
        let tmp = res.data.orgs[i];
        tempOrgs.push({
            id: tmp.id,
            key: tmp.id,
            name: tmp.name,
            subjects: tmp.subjects,
            status: tmp.status,
            telephone: tmp.telephone,
        });
      }
      setOrgList(tempOrgs);
    }else {
      message.warning("获取机构列表失败：" + res.err_msg);
      return;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
 
  return (
    <div style={{ padding: 40, height: "100%", width: "100%" }}>
       <Breadcrumb>
        <Breadcrumb.Item>机构管理</Breadcrumb.Item>
        <Breadcrumb.Item>审核机构</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        pagination={false}
        style={{ marginTop: "30px" }}
        columns={columns}
        dataSource={orgList}
         />
      <ReviewOrgModel refreshData={()=>fetchData()} orgData={orgData} visible={reviewOrgModelVisible} closeModel={()=>{setReviewOrgModelVisible(false)}}/>
    </div>
  );
}

export default OrgReview;
