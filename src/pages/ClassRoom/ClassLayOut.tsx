import { NavLink, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';

const { Header, Content } = Layout;

const LinkMenuClassRoom = [
  {
    label: 'News',
    path: 'news',
  },
  {
    label: 'Members',
    path: 'members',
  },
  {
    label: 'Grade',
    path: 'grade',
  },
];

export default function ClassLayOut() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerHeight: 52,
          },
          Menu: {
            activeBarHeight: 4,
            horizontalItemBorderRadius: 0,
            horizontalItemHoverBg: '#f5f5f5',
          },
        },
      }}
    >
      <Layout className=" bg-white m-0 h-full w-full">
        <Header className="twp p-0">
          <Menu
            theme="light"
            mode="horizontal"
            className="px-4"
            defaultSelectedKeys={[
              window.location.pathname.substring(
                window.location.pathname.lastIndexOf('/') + 1
              ),
            ]}
            items={items}
          ></Menu>
        </Header>
        <Content className="bg-white m-0 h-full w-full d-flex justify-center items-center">
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
const items: MenuProps['items'] = LinkMenuClassRoom.map((item, index) => ({
  label: (
    <NavLink className="p-4" to={item.path}>
      {item.lable}
    </NavLink>
  ),
  key: item.path,
}));
