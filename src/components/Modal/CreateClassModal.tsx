import React, { useEffect, useState } from 'react';
import { App, Form, Input, Modal } from 'antd';
import { useQueryClient } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { useAddClass } from '@/app/store/server/features/classroom/mutations';

interface CreateClassProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateClassModal({ open, setOpen }: CreateClassProps) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const queryClient = useQueryClient();
  const addClass = useAddClass();
  const { notification } = App.useApp();

  const handleSubmit = (values: any) => {
    addClass.mutate(values, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        setConfirmLoading(false);
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
        }
        notification.error({
          message: 'Create class failed',
          description: error.message,
        });
      },
    });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setConfirmLoading(false);
  }, [addClass.isSuccess, setOpen]);

  return (
    <Modal
      title="Create new class"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          rules={[{ required: true, message: 'Please input class name!' }]}
          label="Class Name"
          name="name"
        >
          <Input placeholder="Input Class Name" />
        </Form.Item>

        <Form.Item label="Class Description" name="description">
          <Input placeholder="Input class description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
