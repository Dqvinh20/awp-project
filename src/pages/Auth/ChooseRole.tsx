import { Button, Form, Input, Select } from 'antd';

import { useQueryClient } from '@tanstack/react-query';

import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import { useFinishSignUp } from '@/app/store/server/features/auth/mutations';
import { FinishSignupData } from '@/app/store/server/features/auth/interfaces';

const { Option } = Select;

const layout = {
  labelCol: { offset: 0, span: 6 },
  wrapperCol: { span: 16 },
};

function ChooseRoleForm() {
  const [form] = Form.useForm();
  const { mutate: finishSignUpMutate, isPending } = useFinishSignUp();
  const queryClient = useQueryClient();

  const onFinish = (values: FinishSignupData) => {
    finishSignUpMutate(values, {
      onSuccess() {
        return queryClient.invalidateQueries({
          queryKey: ['user', 'me'],
        });
      },
    });
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      colon={false}
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      initialValues={{ role: USER_ROLE.Student }}
    >
      <Form.Item name="role" label="Role" rules={[{ required: true }]}>
        <Select placeholder="Choose your role">
          <Option value={USER_ROLE.Teacher}>Teacher</Option>
          <Option value={USER_ROLE.Student}>Student</Option>
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
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ChooseRoleForm;
