import React, { useState } from 'react';
import { FieldTimeOutlined, UserOutlined, PieChartOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { Breadcrumb, Layout, Menu, theme, Button, Dropdown, Avatar } from 'antd';
import axiosClient from "../axios-client.js";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdRoomPreferences } from "react-icons/md";
import { FaHome, FaUsers, FaProjectDiagram, FaUserShield, FaTasks, FaCarAlt } from "react-icons/fa";
import DropDownProfile from './DropDownProfile';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, to, children) {
  return {
    key,
    icon,
    children,
    label,
    to,
  };
}

const items = [
  getItem('Dashboard', '1', <PieChartOutlined />, '/dashboard'),

  getItem('GT Reservation', '2', <BsCalendarDateFill />, '/reservation', [
    getItem('Rooms', '3', <MdRoomPreferences />, '/rooms'),
    getItem('Reservation', '4', <BsCalendarDateFill />, '/reservations'),
  ]),
  getItem('GT Projects', '5', <FaProjectDiagram />, null, [
    getItem('Projects', '6', <FaProjectDiagram />, '/projects'),
    getItem('Project Members', '7', <FaUserShield />, '/project-members'),
    getItem('Tasks', '8', <FaTasks />, '/tasks'),
  ]),
  getItem('GT Vehicles', '9', <FaCarAlt />, null, [
    getItem('Vehicles', '10', <FaCarAlt />, '/vehicles'),
    getItem('VehiculeTasks ', '11', <FaTasks />, '/VehiculeTasks'),
  ]),
  getItem('GT Users', '12', <FaUsers />, '/users', [
    getItem('Users', '13', <FaUsers />, '/users'),
  ]),
];





export default function DefaultLayout() {
  const onLogout = () => {
    axiosClient.post('/logout').then(() => {
      setUser({});
      setToken(null);
    });
  };
  const atems = [
    {
      label: (
        <span>Profile</span>
      ),
      key: '14',
    },
    {
      label: (
        <span onClick={onLogout}>Logout</span>
      ),
      key: '15',
    },
  ];
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [childrenKey, setChildrenKey] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { token, setUser, setToken } = useStateContext(); // Assuming you have setUser and setToken functions in your context
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleClick = (key, children) => {
    setSelectedKey(key);
    setChildrenKey(children);
  };
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    background: colorBgContainer,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          {items.map(item => {
            if (item.children) {
              return (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map(child => (
                    <Menu.Item key={child.key} icon={child.icon}>
                      <Link to={child.to} onClick={() => handleClick(item.label, child.label)}>{child.label}</Link>
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.to} onClick={() => handleClick(item.label, null)}>{item.label}</Link>
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
      <Layout>
      <Header style={headerStyle}>
  <Button
    type="text"
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={() => setCollapsed(!collapsed)}
    style={{
      fontSize: '16px',
      lineHeight: '64px',
      padding: '0 24px',
      cursor: 'pointer',
      transition: 'color 0.3s',
    }}
  />
  <Dropdown
    overlay={
      <Menu>
        {atems.map(item => (
          <Menu.Item key={item.key}>{item.label}</Menu.Item>
        ))}
      </Menu>
    }
    placement="bottomRight"
  >
    <a onClick={(e) => e.preventDefault()}>
      <Avatar size={30} icon={<UserOutlined />} />
    </a>
  </Dropdown>
</Header>

        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>{selectedKey}</Breadcrumb.Item>
            <Breadcrumb.Item>{childrenKey}</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>TAC-TIC ©{new Date().getFullYear()} Created By Rafrafi Med Ali</Footer>
      </Layout>
    </Layout>
  );
}
