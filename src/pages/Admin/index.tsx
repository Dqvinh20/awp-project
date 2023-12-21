import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// eslint-disable-next-line no-duplicate-imports
import {
  Breadcrumb,
  Button,
  Collapse,
  Layout,
  Menu,
  Modal,
  Table,
  theme,
} from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [getItem('Option 1', '1', <UserOutlined />)];

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Row',
    dataIndex: 'key',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },

  {
    title: 'Role',
    dataIndex: 'role',
    sorter: (a, b) => a.role.localeCompare(b.role),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.toString().localeCompare(b.status.toString()),
  },
  // {
  //   title: '',
  //   dataIndex: 'action',
  // },
];
const data: DataType[] = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i + 1,
    name: `Edward King ${i}`,
    email: `EdwardK${i}.gmail.com`,
    role: i % 2 === 0 ? 'Teacher' : 'Student',
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  });
}
function Admin() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <Layout className="min-h-screen">
      <Sider theme="light" collapsed={collapsed}>
        Logo
        <Menu defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content className="mx-4">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="mb-4"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              border: '1px solid #d9d9d9',
            }}
          >
            <Collapse defaultActiveKey={['1']} ghost expandIconPosition="end">
              <Collapse.Panel header="This is panel header 1" key="1">
                <p>Content</p>
              </Collapse.Panel>
            </Collapse>
          </div>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              border: '1px solid #d9d9d9',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="">Account Management</div>
              <Button type="primary" className="my-5" onClick={showModal}>
                Add Account
              </Button>
              <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
              >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </Modal>
            </div>
            <div>
              <div style={{ marginBottom: 16 }}></div>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
              />
            </div>
          </div>
        </Content>
        <Footer className="text-center">
          Advanced Web Programming - Classroom ©2023 Created by Group
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Admin;
