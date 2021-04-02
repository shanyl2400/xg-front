import React from 'react';
import { Switch, Route } from "react-router-dom";

import loadable from '../utils/loadingComponent'

const StudentList = loadable(() => import('./StudentList'));
const CreateStudent = loadable(() => import('./CreateStudent'));
const OrderDispatch = loadable(() => import('./OrderDispatch'));
const OrderReview = loadable(() => import('./OrderReview'));
const OrgOrderList = loadable(() => import('./OrgOrderList2'));
const AuthorOrderList = loadable(() => import('./AuthorOrderList'));
const OrderList = loadable(() => import('./OrderList'));
const OrderResource = loadable(() => import('./OrderResource'));
const SubjectList = loadable(() => import('./SubjectList'));
const CreateOrg = loadable(() => import('./CreateOrg'));
const OrgReview = loadable(() => import('./OrgReview'));
const OrgList = loadable(() => import('./OrgList'));
const CreateUser = loadable(() => import('./CreateUser'));
const UserList = loadable(() => import('./UserList'));
const CreateRole = loadable(() => import('./CreateRole'));
const RoleList = loadable(() => import('./RoleList'));
const UserInfo = loadable(() => import('./UserInfo'));
const StudentDetails = loadable(() => import('./StudentDetails'));
const CreateStudentOrder = loadable(() => import('./CreateStudentOrder'));
const OrderDetails = loadable(() => import('./OrderDetails2'));
const OrgDetails = loadable(() => import('./OrgDetails'));
const Dashboard = loadable(() => import('./NewDashboard'));
const Login = loadable(() => import('./Login'));
const OrderRemarksList = loadable(() => import('./OrderRemarksList'));
const StatisticTable = loadable(() => import('./StatisticTable'));
const AllStudentList = loadable(() => import('./AllStudentList'));
const OrgNearExpireList = loadable(() => import('./OrgNearExpireList'));

const UpdateOrg = loadable(() => import('./UpdateOrg'));
const OrgInfo = loadable(() => import('./OrgInfo'));
const UpdateOrgSelf = loadable(() => import('./UpdateOrgSelf'));
const OrderNotifies = loadable(() => import('./OrderNotifies'));
const ConflictList = loadable(() => import('./ConflictList'));
const ConflictHandler = loadable(() => import('./ConflictHandler'));
const CreateSettlement = loadable(() => import('./CreateSettlement'));
const SettlementList = loadable(() => import('./SettlementList'));
const UserStatisticTable = loadable(() => import('./UserStatisticsTable'));
const OrgStatisticTable = loadable(() => import('./OrgStatisticsTable'));
function XgRouter() {
    return (
        <Switch>
            <Route path="/main/student_list">
                <StudentList />
            </Route>
            <Route path="/main/statistics/orgs">
                <OrgStatisticTable />
            </Route>
            <Route path="/main/statistics/users">
                <UserStatisticTable />
            </Route>
            <Route path="/main/statistics">
                <StatisticTable />
            </Route>
            <Route path="/main/remark_list">
                <OrderRemarksList />
            </Route>
            <Route path="/main/create_student">
                <CreateStudent />
            </Route>
            <Route path="/main/order_notify">
                <OrderNotifies />
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
            <Route path="/main/all_student_list">
                <AllStudentList />
            </Route>
            <Route path="/main/conflict_student_list">
                <ConflictList />
            </Route>
            <Route path="/main/conflict_student/:id">
                <ConflictHandler />
            </Route>
            <Route path="/main/create_org">
                <CreateOrg />
            </Route>
            <Route path="/main/review_org">
                <OrgReview />
            </Route>
            <Route path="/main/create_settlement">
                <CreateSettlement />
            </Route>
            <Route path="/main/org_list">
                <OrgList />
            </Route>
            <Route path="/main/org_near_expire_list">
                <OrgNearExpireList />
            </Route>

            <Route path="/main/list_settlement">
                <SettlementList />
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
            <Route path="/main/org_update/:id">
                <UpdateOrg />
            </Route>
            <Route path="/main/org_update_self">
                <UpdateOrgSelf />
            </Route>
            <Route path="/main/org_info">
                <OrgInfo />
            </Route>
            <Route path="/main">
                <Dashboard />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
        </Switch>
    );
}
export default XgRouter;