import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
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
import OrderDetails from './OrderDetails';
import OrgDetails from './OrgDetails';
import OrgOrderList from './OrgOrderList';
import AuthorOrderList from './AuthorOrderList';
function XgRouter() {
    return (
        <Switch>
            <Route path="/main/student_list">
                <StudentList />
            </Route>
            <Route path="/main/create_student">
                <CreateStudent />
            </Route>
            <Route path="/main/dispatch_order">
                <OrderDispatch />
            </Route>
            <Route path="/main/review_order">
                <OrderReview />
            </Route>
            <Route path="/main/order_list/org">
                <OrgOrderList />
            </Route>
            <Route path="/main/order_list/author">
                <AuthorOrderList />
            </Route>
            <Route path="/main/order_list">
                <OrderList />
            </Route>
            <Route path="/main/order_source">
                <OrderResource />
            </Route>
            <Route path="/main/subject_list">
                <SubjectList />
            </Route>
            <Route path="/main/subject_list">
                <SubjectList />
            </Route>
            <Route path="/main/subject_list">
                <SubjectList />
            </Route>
            <Route path="/main/create_org">
                <CreateOrg />
            </Route>
            <Route path="/main/review_org">
                <OrgReview />
            </Route>
            <Route path="/main/org_list">
                <OrgList />
            </Route>
            <Route path="/main/create_user">
                <CreateUser />
            </Route>
            <Route path="/main/user_list">
                <UserList />
            </Route>
            <Route path="/main/create_role">
                <CreateRole />
            </Route>
            <Route path="/main/role_list">
                <RoleList />
            </Route>
            <Route path="/main/user_info">
                <UserInfo />
            </Route>
            <Route path="/main/user_info">
                <UserInfo />
            </Route>
            <Route path="/main/student_details/:id">
                <StudentDetails />
            </Route>
            <Route path="/main/student_order/:id">
                <CreateStudentOrder />
            </Route>
            <Route path="/main/order_details/:id">
                <OrderDetails />
            </Route>
            <Route path="/main/org_details/:id">
                <OrgDetails />
            </Route>
            <Route path="/main">
                <Dashboard />
            </Route>
        </Switch>
    );
}
export default XgRouter;