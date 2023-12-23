/* eslint-disable max-lines-per-function */
import { App, Form, Input, Modal, Select } from 'antd';

import { AxiosError } from 'axios';

import { UserOutlined, MailOutlined } from '@ant-design/icons';

import {
  CreateUserDTO,
  USER_ROLE,
} from '@/app/store/server/features/users/interfaces';
import { useCreateAccount } from '@/app/store/server/features/users/mutations';

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
  const createAccount = useCreateAccount();
  const { notification, message } = App.useApp();

  const handleSubmit = ({
    first_name,
    last_name,
    email,
    role,
    student_id,
  }: CreateUserDTO) => {
    createAccount.mutate(
      {
        first_name: first_name?.trim() ?? '',
        last_name: last_name?.trim() ?? '',
        email,
        role,
        student_id,
      },
      {
        onSuccess() {
          form.resetFields();
          setOpen(false);
          return message.success('Create account successfully');
        },
        onError(error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.data.statusCode === 403) {
              notification.error({
                message: 'Create account failed',
                description: "You don't have permission to create account",
              });
              return;
            }

            return notification.error({
              message: 'Create account failed',
              description: response?.data.message ?? 'Some thing went wrong!',
            });
          }
          notification.error({
            message: 'Create account failed',
            description: error.message,
          });
        },
      }
    );
  };

  const handleOk = () => {
    form.validateFields().then(() => {
      form.submit();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      okText="Create"
      onCancel={handleCancel}
      confirmLoading={createAccount.isPending}
      centered
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ role: USER_ROLE.Student }}
      >
        <div className="flex items-center justify-between gap-x-2">
          <Form.Item
            className="flex-1"
            name="first_name"
            label="First Name"
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
            label="First Name"
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
          label="Email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
            {
              type: 'email',
              message: 'Please input a valid email!',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select placeholder="Choose account's role">
            <Select.Option value={USER_ROLE.Teacher}>Teacher</Select.Option>
            <Select.Option value={USER_ROLE.Student}>Student</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.role !== currentValues.role
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('role') === USER_ROLE.Student ? (
              <Form.Item
                name="student_id"
                label="Student ID"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
}
