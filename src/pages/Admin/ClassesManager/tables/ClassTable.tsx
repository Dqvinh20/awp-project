/* eslint-disable max-lines-per-function */
import { Avatar, Button, Input, InputRef, Space, Table, Tag } from 'antd';
import { memo, useMemo, useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  ColumnFilterItem,
  ColumnType,
  FilterConfirmProps,
} from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import { Link } from 'react-router-dom';

import ToggleActiveClass from '../button/ToggleActiveClass';

import { User } from '@/app/store/server/features/users/interfaces';
import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';

interface ClassDataType {
  key: string;
  name: string;
  isActive: boolean;
  created_at: string;
  count_teacher: number;
  count_student: number;
  owner: User;
}

type ClassDataIndex = keyof ClassDataType;

interface ClassTableProps {
  classes?: ClassDTO[];
}

function ClassTable({ classes = [] }: ClassTableProps) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const ownerNames = useMemo(
    () =>
      uniq(classes.map((classObj) => classObj.owner.full_name)).map((name) => ({
        text: name,
        value: name,
      })),
    [classes]
  );

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: ClassDataIndex
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
    dataIndex: ClassDataIndex
  ): ColumnType<ClassDataType> => ({
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
      if (dataIndex === 'name') {
        return searchedColumn === dataIndex ? (
          <Link to={`/classes/${key}`}>
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text}
            />
          </Link>
        ) : (
          <Link to={`/classes/${key}`}>{text}</Link>
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

  const columns: ColumnsType<ClassDataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      align: 'center',
      filters: ownerNames as ColumnFilterItem[],
      filterMode: 'tree',
      filterSearch: true,
      onFilter(value, record) {
        return record.owner?.full_name?.startsWith(value as string) ?? false;
      },
      render: ({ avatar, full_name }: any) => (
        <Space>
          <Avatar src={avatar} icon={<UserOutlined />} />
          <span>{full_name}</span>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'isActive',
      dataIndex: 'isActive',
      align: 'center',
      render: (_, { isActive, key }) => (
        <Tag color={isActive ? 'green' : 'red'} key={`status-${key}`}>
          {isActive ? 'Active'.toUpperCase() : 'inactive'.toUpperCase()}
        </Tag>
      ),
      filters: [
        {
          text: 'Active',
          value: true,
        },
        {
          text: 'Inactive',
          value: false,
        },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Teachers Count',
      dataIndex: 'count_teacher',
      key: 'count_teacher',
      align: 'center',
      sorter: (a, b) => a.count_teacher - b.count_teacher,
    },
    {
      title: 'Students Count',
      dataIndex: 'count_student',
      key: 'count_student',
      align: 'center',
      sorter: (a, b) => a.count_student - b.count_student,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      sorter(a, b) {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      },
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <ToggleActiveClass classId={record.key} isActive={record.isActive} />
        </Space>
      ),
    },
  ];

  const dataSource = useMemo(
    () =>
      classes.map((classObj) => ({
        key: classObj.id,
        name: classObj.name,
        isActive: classObj.isActive,
        owner: classObj.owner,
        created_at: classObj.created_at,
        count_teacher: classObj.teachers.length,
        count_student: classObj.students.length,
      })),
    [classes]
  );

  return (
    <Table
      bordered
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

export default memo(ClassTable);
