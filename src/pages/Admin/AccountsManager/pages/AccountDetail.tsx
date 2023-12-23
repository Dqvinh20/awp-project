/* eslint-disable max-lines-per-function */
import {
  App,
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Form,
  Input,
  Space,
  Spin,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UserOutlined } from '@ant-design/icons';

import ErrorPage from '@/pages/ErrorPage';

import {
  USER_ROLE,
  UpdateUserDto,
  User,
} from '@/app/store/server/features/users/interfaces';
import { useUpdateUser } from '@/app/store/server/features/users/mutations';
import DocumentTitle from '@/components/DocumentTitle';
import useAcountDetail from '@/hooks/useAccountDetail';

function AccountDetail() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const isActiveWatch = Form.useWatch('isActive', form);
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isSuccess, isError, error } = useAcountDetail();
  const { mutate: updateUserMutate, isPending } = useUpdateUser();

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
  const handleUpdateAccount = (values: UpdateUserDto) => {
    if (!data) return null;

    updateUserMutate(
      {
        id: data?.id,
        first_name: values.first_name,
        last_name: values.last_name,
        student_id: values.student_id,
        isActive: values.isActive,
        gender: values.gender,
      },
      {
        async onSuccess() {
          await Promise.allSettled([
            queryClient.invalidateQueries({
              queryKey: ['user', data.id],
            }),
            queryClient.refetchQueries({
              queryKey: ['users'],
            }),
          ]);
          message.success('Updated account successfully');
          setEditing(false);
        },
        onError() {
          message.error('Updated class failed');
        },
      }
    );
  };

  const items = ({
    student_id,
    full_name,
    role,
    gender,
    created_at,
    isActive,
  }: User): DescriptionsProps['items'] => {
    const result = [
      {
        key: '2',
        label: 'Name',
        children: !editing ? (
          full_name
        ) : (
          <div className="flex items-center justify-between gap-x-2">
            <Form.Item
              className="flex-1"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your First Name!',
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Last Name!',
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>
        ),
      },
      {
        key: '6',
        label: 'Status',
        children: !editing ? (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Active'.toUpperCase() : 'Blocked'.toUpperCase()}
          </Tag>
        ) : (
          <Form.Item name="isActive">
            <Switch
              className={`${
                isActiveWatch ?? isActive ? '!bg-green-500' : '!bg-red-500'
              }`}
              checkedChildren="Active"
              unCheckedChildren="Blocked"
            />
          </Form.Item>
        ),
      },
      {
        key: '8',
        label: 'Role',
        children: (
          <Tag color={role === USER_ROLE.Teacher ? 'green' : 'geekblue'}>
            {role.toString().toUpperCase()}
          </Tag>
        ),
      },
      {
        key: '9',
        label: 'Gender',
        children: gender ?? 'User not updated yet',
        span: 1,
      },
      {
        key: '5',
        label: 'Created At',
        children: dayjs(created_at).format('L LT'),
      },
    ];
    return role === USER_ROLE.Teacher
      ? result
      : [
          {
            key: '1',
            label: 'StudentId',
            span: 0,
            children: !editing ? (
              student_id
            ) : (
              <Form.Item
                name="student_id"
                rules={[
                  {
                    max: 10,
                    min: 0,
                    message: 'Student ID must be between 0-10 characters.',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ),
          },
          ...result,
        ];
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <DocumentTitle title={data.full_name ?? ''} />
      {isSuccess && (
        <div className="h-full p-6">
          <Form form={form} initialValues={data} onFinish={handleUpdateAccount}>
            <Descriptions
              layout="vertical"
              title={
                <Space>
                  <Avatar src={data.avatar} icon={<UserOutlined />} />
                  <Tooltip title={`Mail to ${data.email}`}>
                    <a className="" href={`mailto:${data.email}`}>
                      {data.email}
                    </a>
                  </Tooltip>
                  <Tag color={data.isEmailConfirmed ? 'green' : 'red'}>
                    {data.isEmailConfirmed
                      ? 'Mail Confirmed'.toUpperCase()
                      : 'Mail UnConfirmed'.toUpperCase()}
                  </Tag>
                </Space>
              }
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
      )}
    </>
  );
}

export default AccountDetail;
