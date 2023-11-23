import { useState } from 'react';
import { Divider, Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import SubMenu from 'antd/es/menu/SubMenu';
import Icon from '@ant-design/icons/lib/components/Icon';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeOutlined />),

  { type: 'divider' },

  getItem('Setting', 'setting', <SettingOutlined />),
];

interface AppSiderProps {
  collapsed: boolean;
  setCollapsed(value: boolean): void;
}

function AppSider({ collapsed, setCollapsed }: AppSiderProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <Sider
      // style={{
      //   overflow: 'auto',
      //   height: '100vh',
      //   position: 'fixed',
      //   left: 0,
      //   top: 0,
      //   bottom: 0,
      // }}
      className="twp !border-r !border-r-gray-300"
      width={200}
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="sm"
      collapsedWidth={isMobile ? 0 : 80}
      onBreakpoint={(broken) => {
        setIsMobile(broken);
        if (!collapsed && broken) setCollapsed(true);
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item className="" key={'home'} style={{ float: 'right' }}>
          <NavLink to={'home'}>Home</NavLink>
        </Menu.Item>
        <Divider className='m-0'></Divider>
        <SubMenu
          key="sub1"
          title={'Class'
          }
        >
          <Menu.Item className="" key={'home2'} style={{ float: 'right' }}>
            <NavLink to={'home2'}>Home</NavLink>
          </Menu.Item>
          <Menu.Item className="" key={'home1'} style={{ float: 'right' }}>
            <NavLink to={'home1'}>Home1</NavLink>
          </Menu.Item>
        </SubMenu>
        
      </Menu>
    </Sider>
  );
}

export default AppSider;
