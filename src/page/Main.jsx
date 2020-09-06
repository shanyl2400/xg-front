import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import { Layout } from 'antd';
import SideMenu from './SideMenu';
import CreateStudent from './CreateStudent';
import CreateStudentOrder from './CreateStudentOrder';
import StudentList from './StudentList';
import UserInfo from './UserInfo';
import StudentDetails from './StudentDetails';
import Dashboard from './Dashboard';
import OrderDispatch from './OrderDispatch';
import OrderList from './OrderList';
import OrderReview from './OrderReview';
import OrderResource from './OrderResource';
import SubjectList from './SubjectList';
import CreateOrg from './CreateOrg';
import OrgReview from './OrgReview';
import OrgList from './OrgList';
import CreateUser from './CreateUser';
import CreateRole from './CreateRole';
import UserList from './UserList';
import RoleList from './RoleList';
import "./Main.css";

const { Content, Sider } = Layout;

function Main() {
  const [menuIndex, setMenuIndex] = useState(0);
  const [studentDetailsId, setStudentDetailsId] = useState(0);
  const [menuFrom, setMenuFrom] = useState(0);
  
  let history = useHistory();
  let token = sessionStorage.getItem("token");
  if(token == null){
    history.push("/");
  }

  const Menus = [
    <Dashboard />,
    <CreateStudent onCreateStudentOrder={(id)=>handleUpdateSideMenuWithIdAndMenuFrom(4, 0, id)}/>,
    <StudentList onStudentDetails={(id)=>handleUpdateSideMenuWithId(3, id)} onCreateStudentOrder={(id)=>handleUpdateSideMenuWithIdAndMenuFrom(4, 1, id)}/>,
    <OrderDispatch />,
    <OrderReview />,
    <OrderList />,
    <OrderResource />,
    <SubjectList />,
    <CreateOrg />,
    <OrgReview />,
    <OrgList />,
    <CreateUser />,
    <UserList />,
    <CreateRole />,
    <RoleList />,
    <UserInfo />,
    <StudentDetails onBack={()=>handleUpdateSideMenu(1)} studentId={studentDetailsId}/>,
    <CreateStudentOrder onBack={(index)=>handleUpdateSideMenu(index)} from={menuFrom} studentId={studentDetailsId}/>
  ];

  let handleUpdateSideMenu = (index) => {
    setMenuIndex(index);
  }
  let handleUpdateSideMenuWithId = (index, id) => {
    setMenuIndex(index);
    setStudentDetailsId(id);
  }
  let handleUpdateSideMenuWithIdAndMenuFrom = (index, menuFrom, id) => {
    setMenuIndex(index);
    setMenuFrom(menuFrom)
    setStudentDetailsId(id);
  }

  return (
      <Layout 
       style={{ height:'100%' }}>
      <Sider>
        <SideMenu handleUpdateSideMenu={(e)=>handleUpdateSideMenu(e)}></SideMenu>
      </Sider>
      <Content style={{ padding: '10px 80px',textAlign:"left", backgroundColor:"#fff" }}>
        {Menus[menuIndex]}
      </Content>
      </Layout>
    );
  }
  
  export default Main;
  