/* eslint-disable max-lines-per-function */
import { useQueryClient } from '@tanstack/react-query';
import { App, Form, Input, Modal } from 'antd';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

import { useJoinClass } from '@/app/store/server/features/classroom/mutations';
import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';

interface JoinClassProps {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface JoinClassFormValues {
  c: string;
}

function JoinClassModal({
  open,
  setOpen,
  title = 'Join new class',
}: JoinClassProps) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const queryClient = useQueryClient();
  const joinClass = useJoinClass();
  const { notification } = App.useApp();
  const [disabledSave, setDisabledSave] = useState(true);

  const handleSubmit = (values: JoinClassFormValues) => {
    joinClass.mutate(values, {
      onSuccess(data: ClassDTO) {
        queryClient.invalidateQueries({ queryKey: ['classes'] });
        setConfirmLoading(false);
        notification.success({
          message: 'Join class successfully',
          description: `You have joined ${data.name}`,
        });
        form.resetFields();
        setOpen(false);
      },
      onError(error: any) {
        setConfirmLoading(false);
        if (error instanceof AxiosError) {
          const { response } = error;
          if (response?.data.statusCode === 403) {
            notification.error({
              message: 'Join class failed',
              description: "You don't have permission to create class",
            });
            return;
          }
          if (response?.data.message.includes('User already in class')) {
            form.setFields([
              {
                name: 'c',
                errors: ['You have already joined this class'],
              },
            ]);
            return;
          }
          form.setFields([
            {
              name: 'c',
              errors: [error.response?.data.message],
            },
          ]);
          return;
        }

        notification.error({
          message: 'Join class failed',
          description: error.message,
        });
      },
    });
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
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
  }, [joinClass.isSuccess, setOpen]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      centered
      okButtonProps={{
        disabled: disabledSave,
      }}
      okText={'Join'}
    >
      <Form<JoinClassFormValues>
        form={form}
        onFinish={handleSubmit}
        onFieldsChange={handleFormChange}
        layout="vertical"
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input class code to join!',
            },
            {
              len: 7,

              message: 'Class code must be 7 characters!',
            },
          ]}
          label="Class Code"
          name="c"
        >
          <Input placeholder="Input Class Code" showCount maxLength={7} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default JoinClassModal;
