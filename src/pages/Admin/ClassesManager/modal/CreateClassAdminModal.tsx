/* eslint-disable max-lines-per-function */
import React, { useEffect, useState } from 'react';
import { App, Form, Input, Modal, Select, SelectProps } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { useAddClass } from '@/app/store/server/features/classroom/mutations';
import { useSearchEmails } from '@/app/store/server/features/users/queries';
import useDebounce from '@/hooks/useDebounce';
import { USER_ROLE, User } from '@/app/store/server/features/users/interfaces';

interface CreateClassProps {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateClassAdminModal({
  title = 'Create new class',
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
        <Form.Item
          rules={[{ required: true, message: 'Please input Class Name!' }]}
          label="Class Name"
          name="name"
        >
          <Input placeholder="Input Class Name" />
        </Form.Item>

        <Form.Item label="Class Description" name="description">
          <Input.TextArea
            placeholder="Input class description"
            showCount
            maxLength={500}
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label="Class Owner"
          name="owner"
          rules={[
            {
              required: true,
              message: 'Please select Class Owner!',
            },
          ]}
        >
          <Select
            loading={searchForTeacher && (isLoading || isFetching)}
            onFocus={() => {
              setSearchForTeacher(true);
              if (!options) {
                setSearchText('');
              }
            }}
            optionFilterProp="label"
            showSearch
            allowClear
            value={selectedEmails.owner}
            placeholder="Select owner"
            onChange={(value) => {
              setSelectedEmails((prev) => ({ ...prev, owner: value }));
              setSearchText('');
            }}
            onSearch={handleSearch}
            options={options}
          />
        </Form.Item>
        <Form.Item label="Teachers" name="teachers">
          <Select
            mode="multiple"
            loading={searchForTeacher && (isLoading || isFetching)}
            onFocus={() => {
              setSearchForTeacher(true);
              if (!options) {
                setSearchText('');
              }
            }}
            showSearch
            allowClear
            optionFilterProp="label"
            value={selectedEmails.teachers}
            placeholder="Select teachers"
            onChange={(values) => {
              setSelectedEmails((prev) => ({ ...prev, teachers: values }));
              setSearchText('');
            }}
            onSearch={handleSearch}
            options={options}
          />
        </Form.Item>
        <Form.Item label="Students" name="students">
          <Select
            placeholder="Select students"
            mode="multiple"
            loading={!searchForTeacher && (isLoading || isFetching)}
            onFocus={() => {
              setSearchForTeacher(false);
              if (!options) {
                setSearchText('');
              }
            }}
            value={selectedEmails.students}
            showSearch
            allowClear
            optionFilterProp="label"
            onChange={(values) => {
              setSelectedEmails((prev) => ({ ...prev, students: values }));
              setSearchText('');
            }}
            onSearch={handleSearch}
            options={options}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
