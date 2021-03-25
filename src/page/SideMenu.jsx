import { Menu } from 'antd';
import React from 'react';
import { useHistory, useLocation } from "react-router-dom";
import { TeamOutlined, BankOutlined, MessageOutlined, CustomerServiceOutlined, HistoryOutlined, BellOutlined, ExclamationCircleOutlined, FileTextOutlined, TableOutlined, DatabaseOutlined, PicLeftOutlined, CompassOutlined, UserSwitchOutlined, IdcardOutlined, HighlightOutlined, UnorderedListOutlined, ProfileOutlined, FileAddOutlined, UserAddOutlined, GroupOutlined, CheckCircleOutlined, PlusCircleOutlined, SolutionOutlined, GoldOutlined, UserOutlined, ApartmentOutlined, FileExcelOutlined, OrderedListOutlined, BarsOutlined, AuditOutlined, FileSyncOutlined } from '@ant-design/icons';
import { checkAuthorities } from '../utils/auth';
import logo from '../logo.png';
import favicon from '../favicon.png';
import './SideMenu.css';

const { SubMenu } = Menu;

function SideMenu(props) {

  let history = useHistory();
  const handleClick = e => {
    history.push(e.key);
  };

  const checkAuthForMenu = (authList, tag) => {
    let flag = checkAuthorities(authList);
    if (flag) {
      return tag;
    }
    return <span></span>;
  }


  let location = useLocation();
  return (
    <Menu
      onClick={handleClick}
      theme={props.theme}
      style={{
        height: "100vh",
        overflowY: "overlay",
        overflowX: "hidden",
        border: "none",
      }}
      defaultSelectedKeys={[location.pathname]}
      defaultOpenKeys={[]}
      mode="inline"
    >



      {props.collapsed ?
        <div style={{
          textAlign: "center"
        }}>
          <img src={favicon} className="logo" style={{
            width: "50%"
          }} />
        </div> : <img src={logo} className="logo" style={{
          maxWidth: 256
        }} />}


      {checkAuthForMenu(["查看所有订单"], <Menu.Item key={"/main"} icon={<CompassOutlined />}>控制台</Menu.Item>)}


      {checkAuthForMenu(["查看所有订单"], <SubMenu
        key="statistics"
        title={
          <span>
            <DatabaseOutlined />
            <span>统计数据</span>
          </span>
        }>
        <Menu.Item key={"/main/statistics"} icon={<TableOutlined />}>统计表</Menu.Item>
      </SubMenu>)}

      {checkAuthForMenu(["录单权", "全名单派单权"], <SubMenu
        key="sub1"
        title={
          <span>
            <TeamOutlined />
            <span>学员管理</span>
          </span>
        }>
        {checkAuthForMenu(["录单权"], <Menu.Item key={"/main/create_student"} icon={<FileAddOutlined />}>录入名单</Menu.Item>)}
        {checkAuthForMenu(["录单权"], <Menu.Item key={"/main/student_list"} icon={<SolutionOutlined />}>我的名单</Menu.Item>)}

        {checkAuthForMenu(["全名单派单权"], <Menu.Item key={"/main/all_student_list"} icon={<PicLeftOutlined />}>所有名单</Menu.Item>)}
        {checkAuthForMenu(["全名单派单权"], <Menu.Item key={"/main/conflict_student_list"} icon={<ExclamationCircleOutlined />}>冲单列表</Menu.Item>)}

      </SubMenu>)}

      {checkAuthForMenu(["自派单权", "全名单派单权", "审核订单权限", "查看所有订单", "订单来源管理", "机构订单权限"],
        <SubMenu
          key="sub2"
          title={
            <span>
              <OrderedListOutlined />
              <span>订单管理</span>
            </span>
          }>
          {checkAuthForMenu(["全名单派单权"], <Menu.Item key={"/main/dispatch_order"} icon={<FileSyncOutlined />}>派单</Menu.Item>)}
          {checkAuthForMenu(["审核订单权限"], <Menu.Item key={"/main/review_order"} icon={<AuditOutlined />}>审核订单</Menu.Item>)}
          {checkAuthForMenu(["审核订单权限", "查看所有订单"], <Menu.Item key={"/main/order_list"} icon={<BarsOutlined />}>派单记录</Menu.Item>)}
          {checkAuthForMenu(["自派单权", "全名单派单权"], <Menu.Item key={"/main/order_list/author"} icon={<FileTextOutlined />}>我的派单</Menu.Item>)}
          {checkAuthForMenu(["机构订单权限"], <Menu.Item key={"/main/order_list/org"} icon={<BarsOutlined />}>推荐列表</Menu.Item>)}
          {checkAuthForMenu(["订单来源管理"], <Menu.Item key={"/main/order_source"} icon={<GroupOutlined />}>订单来源</Menu.Item>)}
        </SubMenu>)}
      {checkAuthForMenu(["课程分类管理"], <SubMenu
        key="sub3"
        title={
          <span>
            <GoldOutlined />
            <span>课程管理</span>
          </span>
        }>
        <Menu.Item key={"/main/subject_list"} icon={<ApartmentOutlined />}>课程分类</Menu.Item>
      </SubMenu>)}

      {checkAuthForMenu(["机构管理", "机构审核"],
        <SubMenu
          key="sub4"
          title={
            <span>
              <BankOutlined />
              <span>机构管理</span>
            </span>
          }>
          {checkAuthForMenu(["机构管理"], <Menu.Item key={"/main/create_org"} icon={<PlusCircleOutlined />}>添加机构</Menu.Item>)}
          {checkAuthForMenu(["机构审核"], <Menu.Item key={"/main/review_org"} icon={<CheckCircleOutlined />}>审核机构</Menu.Item>)}
          {checkAuthForMenu(["机构管理"], <Menu.Item key={"/main/org_near_expire_list"} icon={<HistoryOutlined />}>临过期机构</Menu.Item>)}
          {checkAuthForMenu(["机构管理", "机构审核"], <Menu.Item key={"/main/org_list"} icon={<GroupOutlined />}>机构列表</Menu.Item>)}
        </SubMenu>)}

      {checkAuthForMenu(["管理本机构信息", "机构订单权限"],
        <SubMenu
          key="sub4"
          title={
            <span>
              <BankOutlined />
              <span>校区管理</span>
            </span>
          }>
          {checkAuthForMenu(["机构订单权限"], <Menu.Item key={"/main/org_info"} icon={<UnorderedListOutlined />}>校区信息</Menu.Item>)}
          {checkAuthForMenu(["管理本机构信息"], <Menu.Item key={"/main/org_update_self"} icon={<HighlightOutlined />}>修改校区</Menu.Item>)}
        </SubMenu>)}

      {checkAuthForMenu(["用户管理", "角色管理"],
        <SubMenu
          key="sub5"
          title={
            <span>
              <UserSwitchOutlined />
              <span>人员管理</span>
            </span>
          }>
          {checkAuthForMenu(["用户管理"], <Menu.Item key={"/main/create_user"} icon={<UserAddOutlined />}>添加用户</Menu.Item>)}
          {checkAuthForMenu(["用户管理"], <Menu.Item key={"/main/user_list"} icon={<IdcardOutlined />}>用户列表</Menu.Item>)}
          {checkAuthForMenu(["角色管理"], <Menu.Item key={"/main/role_list"} icon={<ProfileOutlined />}>角色列表</Menu.Item>)}
          {/* <Menu.Item key={"/main/create_role"} icon={<ScheduleOutlined />}>添加角色</Menu.Item> */}
        </SubMenu>)}

      {checkAuthForMenu(["查看所有订单", "自派单权", "全名单派单权", "机构订单权限"], <SubMenu
        key="sub6"
        title={
          <span>
            <MessageOutlined />
            <span>消息中心</span>
          </span>
        }>
        {checkAuthForMenu(["查看所有订单", "录单权"], <Menu.Item key={"/main/order_notify"} icon={<BellOutlined />}>系统消息</Menu.Item>)}

        <Menu.Item key={"/main/remark_list"} icon={<CustomerServiceOutlined />}>回访消息</Menu.Item>
      </SubMenu>)}

      <Menu.Item key={"/main/user_info"} icon={<UserOutlined />}>个人中心</Menu.Item>
    </Menu>


  );
}

export default SideMenu;