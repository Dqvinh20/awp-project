/* eslint-disable max-lines-per-function */
import {
  App,
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  List,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';

import { useState } from 'react';

import useClassDetail from '@/hooks/useClassDetail';
import ErrorPage from '@/pages/ErrorPage';
import {
  ClassDTO,
  UpdateClassDTO,
} from '@/app/store/server/features/classroom/interfaces';

import { User } from '@/app/store/server/features/users/interfaces';
import { getUserFullNameOrEmail } from '@/utils/index';
import { useUpdateClass } from '@/app/store/server/features/classroom/mutations';

function ClassDetail() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const isActiveWatch = Form.useWatch('isActive', form);
  const [editing, setEditing] = useState(false);

  const { data, isLoading, isSuccess, isError, error } = useClassDetail();
  const { mutate: updateClassMutate, isPending } = useUpdateClass();

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center p-6">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex justify-center items-center p-6">
        <ErrorPage error={error} />
      </div>
    );
  }

  const handleUpdateClass = (values: UpdateClassDTO) => {
    updateClassMutate(
      {
        classId: data?.id,
        isActive: values.isActive,
        name: values.name,
        description: values.description,
      },
      {
        onSuccess() {
          setEditing(false);
          message.success('Updated class successfully');
        },
        onError() {
          message.error('Updated class failed');
        },
      }
    );
  };

  const items = ({
    name,
    description,
    students,
    teachers,
    owner,
    created_at,
    isActive,
  }: ClassDTO): DescriptionsProps['items'] => [
    {
      key: '1',
      label: 'Class',
      children: !editing ? (
        name
      ) : (
        <Form.Item name="name">
          <Input />
        </Form.Item>
      ),
    },
    {
      key: '2',
      label: 'Descriptions',
      children: !editing ? (
        description
      ) : (
        <Form.Item name="description">
          <Input.TextArea showCount maxLength={500} />
        </Form.Item>
      ),
    },
    {
      key: '6',
      label: 'Status',
      children: !editing ? (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active'.toUpperCase() : 'inactive'.toUpperCase()}
        </Tag>
      ) : (
        <Form.Item name="isActive">
          <Switch
            className={`${
              isActiveWatch ?? isActive ? '!bg-green-500' : '!bg-red-500'
            }`}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
        </Form.Item>
      ),
    },

    {
      key: '7',
      label: 'Owner',
      children: (
        <Space>
          <Avatar src={owner.avatar} />
          <span className="text-base font-semibold">{owner.full_name}</span> -
          <Tooltip title={`Mail to ${owner.email}`}>
            <a className="" href={`mailto:${owner.email}`}>
              {owner.email}
            </a>
          </Tooltip>
        </Space>
      ),
      span: 2,
    },
    {
      key: '5',
      label: 'Created At',
      children: dayjs(created_at).format('L LT'),
    },

    {
      key: '8',
      label: 'Teacher List',
      children: (
        <List
          className="w-full"
          grid={{ gutter: 16, column: 4 }}
          dataSource={teachers}
          renderItem={(teacher: User) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={teacher.avatar} />}
                title={
                  <span className="text-base font-semibold">
                    {getUserFullNameOrEmail(teacher)}
                  </span>
                }
                description={
                  <Tooltip title={`Mail to ${teacher.email}`}>
                    <a className="" href={`mailto:${teacher.email}`}>
                      {teacher.email}
                    </a>
                  </Tooltip>
                }
              />
            </List.Item>
          )}
        />
      ),
      span: 3,
    },
    {
      key: '9',
      label: 'Student List',
      children: (
        <List
          className="w-full"
          grid={{ gutter: 16, column: 4 }}
          dataSource={students}
          renderItem={(student: User) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={student.avatar} />}
                title={
                  <span className="text-base font-semibold">
                    {getUserFullNameOrEmail(student)}
                  </span>
                }
                description={
                  <Tooltip title={`Mail to ${student.email}`}>
                    <a className="" href={`mailto:${student.email}`}>
                      {student.email}
                    </a>
                  </Tooltip>
                }
              />
            </List.Item>
          )}
        />
      ),
      span: 3,
    },
  ];

  return (
    isSuccess && (
      <div className="h-full p-6">
        <Form form={form} initialValues={data} onFinish={handleUpdateClass}>
          <Descriptions
            layout="vertical"
            title="Class Info"
            size={'middle'}
            items={items(data)}
            extra={
              <Space>
                {editing ? (
                  <>
                    <Button
                      type="primary"
                      loading={isPending}
                      onClick={() => {
                        form.validateFields().then(() => form.submit());
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      type="default"
                      disabled={isPending}
                      onClick={() => {
                        setEditing(false);
                        form.resetFields();
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Space>
            }
          />
        </Form>
      </div>
    )
  );
}

export default ClassDetail;
