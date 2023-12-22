/* eslint-disable max-lines-per-function */
import { useMemo, useRef, useState } from 'react';

import Table, { ColumnType, ColumnsType } from 'antd/es/table';

import { Avatar, Button, Input, InputRef, Space, Tag } from 'antd';

import dayjs from 'dayjs';

import { SearchOutlined, UserOutlined } from '@ant-design/icons';

import { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

import ToggleBlockAccount from '../button/ToggleBlockAccount';

import { USER_ROLE, User } from '@/app/store/server/features/users/interfaces';

interface AccountDataType {
  key: string;
  avatar: string;
  full_name: string;
  email: string;
  role: USER_ROLE;
  isActive: boolean;
  created_at: string;
}

type AccountDataIndex = keyof AccountDataType;

interface AccountTableProps {
  accounts: User[];
  loading?: boolean;
}

function AccountTable({ accounts = [], loading }: AccountTableProps) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const dataSource = useMemo(
    () =>
      accounts.map((user) => ({
        key: user.id,
        avatar: user.avatar,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.isActive,
        created_at: user.created_at,
      })),
    [accounts]
  );

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: AccountDataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: AccountDataIndex
  ): ColumnType<AccountDataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange(visible) {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render(text, { key }) {
      if (dataIndex === 'email') {
        return searchedColumn === dataIndex ? (
          <Link to={`/admin/accounts/${key}`}>
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text}
            />
          </Link>
        ) : (
          <Link to={`/admin/accounts/${key}`}>{text}</Link>
        );
      }

      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      );
    },
  });

  const columns: ColumnsType<AccountDataType> = [
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'left',
      sorter: (a, b) => a.email.localeCompare(b.email),

      ...getColumnSearchProps('email'),
    },
    {
      title: 'Name',
      dataIndex: 'full_name',
      align: 'left',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      render: (_, { avatar, full_name }) => (
        <Space>
          <Avatar src={avatar} icon={<UserOutlined />} />
          <span>{full_name}</span>
        </Space>
      ),
    },

    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (_, { key }) => (
        <Tag
          color={_ === USER_ROLE.Teacher ? 'green' : 'geekblue'}
          key={`role-${key}`}
        >
          {_.toString().toUpperCase()}
        </Tag>
      ),
      filters: [
        {
          text: USER_ROLE.Student,
          value: USER_ROLE.Student,
        },
        {
          text: USER_ROLE.Teacher,
          value: USER_ROLE.Teacher,
        },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (_, { status, key }: any) => (
        <Tag color={status ? 'green' : 'red'} key={`status-${key}`}>
          {status ? 'Active'.toUpperCase() : 'Blocked'.toUpperCase()}
        </Tag>
      ),
      filters: [
        {
          text: 'Active',
          value: true,
        },
        {
          text: 'Banned',
          value: false,
        },
      ],
      onFilter(value, record: any) {
        return record.status === value;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      align: 'center',
      sorter(a, b) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      },
      render: (date: string) => dayjs(date).format('L'),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      fixed: 'right',
      render: (_, record: any) => (
        <Space size="middle">
          <ToggleBlockAccount userId={record.key} isActive={record.status} />
        </Space>
      ),
    },
  ];

  return (
    <Table
      bordered
      loading={loading}
      dataSource={dataSource}
      columns={columns as any}
      pagination={{
        hideOnSinglePage: true,
        showLessItems: true,
        showPrevNextJumpers: true,
        showQuickJumper: true,
        showSizeChanger: true,
        showTitle: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
      }}
    />
  );
}

export default AccountTable;
