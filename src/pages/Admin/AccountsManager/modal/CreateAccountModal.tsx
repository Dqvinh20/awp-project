/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react';
import {
  App,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
} from 'antd';
import { useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

import { useAddClass } from '@/app/store/server/features/classroom/mutations';
import { useSearchEmails } from '@/app/store/server/features/users/queries';
import useDebounce from '@/hooks/useDebounce';
import { USER_ROLE, User } from '@/app/store/server/features/users/interfaces';

interface CreateClassProps {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateAccountModal({
  title = 'Create new account',
  open,
  setOpen,
}: CreateClassProps) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const queryClient = useQueryClient();
  const addClass = useAddClass();
  const { notification, message } = App.useApp();
  const [selectedEmails, setSelectedEmails] = useState<{
    owner: string | null;
    students: string[];
    teachers: string[];
  }>({
    owner: null,
    students: [],
    teachers: [],
  });
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [searchForTeacher, setSearchForTeacher] = useState(true);
  const [searchText, setSearchText] = useState('');

  const debouncedSearchQuery = useDebounce(searchText, 300);

  const { data, isLoading, isFetching } = useSearchEmails({
    email: debouncedSearchQuery,
    role: searchForTeacher ? USER_ROLE.Teacher : USER_ROLE.Student,
  });

  const handleSubmit = (values: any) => {
    setConfirmLoading(true);

    addClass.mutate(values, {
      onSuccess() {
        setConfirmLoading(false);
        setSelectedEmails({
          owner: null,
          students: [],
          teachers: [],
        });
        setSearchForTeacher(true);
        setSearchText('');
        setOpen(false);
        form.resetFields();

        queryClient.invalidateQueries({ queryKey: ['classes'] });
        return message.success('Create class successfully');
      },
      onError(error) {
        setConfirmLoading(false);
        if (error instanceof AxiosError) {
          const { response } = error;
          if (response?.data.statusCode === 403) {
            notification.error({
              message: 'Create class failed',
              description: "You don't have permission to create class",
            });
            return;
          }

          return notification.error({
            message: 'Create class failed',
            description: response?.data.message ?? 'Some thing went wrong!',
          });
        }
        notification.error({
          message: 'Create class failed',
          description: error.message,
        });
      },
    });
  };

  const handleOk = () => {
    form.validateFields().then(() => {
      form.submit();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedEmails({
      owner: null,
      students: [],
      teachers: [],
    });
    setSearchForTeacher(true);
    setSearchText('');
    setOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    const optionsBuilder = (items?: User[]): SelectProps['options'] => {
      if (!items) {
        return;
      }
      const { owner, students, teachers } = selectedEmails;
      const selectedList = [...students, ...teachers, owner].filter(
        (email) => email
      ) as string[];

      return items
        .filter(({ id }) => !selectedList.includes(id))
        .map(({ id, email }) => ({
          label: email,
          value: id,
        }));
    };
    setOptions(optionsBuilder(data?.items));
  }, [data?.items, selectedEmails]);

  useEffect(() => {
    setOpen(false);
    setConfirmLoading(false);
  }, [addClass.isSuccess, setOpen]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      centered
      destroyOnClose
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form
          className="color-primary-500"
          form={form}
          initialValues={{
            remember: true,
          }}
          // onFinish={onFinish}
        >
          <div className="w-full flex flex-col justify-between gap-0 sm:flex-row sm:gap-2">
            <Form.Item
              className="w-full"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: 'Please input your First Name!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="First Name"
              />
            </Form.Item>
            <Form.Item
              className="w-full"
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
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
        </Form>
      </Form>
    </Modal>
  );
}
