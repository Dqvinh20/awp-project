/* eslint-disable max-lines-per-function */
import { Form, Input, Modal, ModalProps, Select, Spin } from 'antd';
import { useEffect } from 'react';

import Swal from 'sweetalert2';
import { useQueryClient } from '@tanstack/react-query';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useUpdateUser } from '@/app/store/server/features/users/mutations';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

type EditProfileModalProps = Omit<ModalProps, 'onOk'>;

function EditProfileModal(props: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const { data: myInfo, isLoading, isSuccess } = useGetMyInfo();
  const [form] = Form.useForm();

  useEffect(() => {
    if (myInfo) {
      form.setFieldsValue({
        ...(myInfo.role === USER_ROLE.Student
          ? { student_id: myInfo.student_id }
          : {}),
        name: myInfo.full_name,
        first_name: myInfo.first_name,
        last_name: myInfo.last_name,
        gender: myInfo?.gender,
      });
    }
  }, [form, myInfo]);

  const updateProfile = useUpdateUser();

  const onFinish = (values: any) => {
    updateProfile.mutate(
      {
        id: myInfo?.id,
        ...values,
      },
      {
        onSuccess() {
          Swal.fire({
            title: 'Success!',
            text: "Update user's profile successfully!",
            icon: 'success',
          });
          return queryClient.invalidateQueries({
            queryKey: ['user'],
          });
        },
        onError(error: any) {
          Swal.fire({
            title: 'Error!',
            text: error?.response?.data?.message[0] ?? 'Something went wrong!',
            icon: 'error',
          });
        },
      }
    );
  };

  return (
    <Modal
      {...props}
      destroyOnClose
      onOk={() => {
        form.submit();
      }}
    >
      <div className="flex justify-center w-full">
        <div className="flex flex-col">
          {isLoading ? (
            <Spin />
          ) : (
            <>
              <h2 className="text-center mb-5">Edit profile</h2>
              {isSuccess && (
                <Form
                  layout="horizontal"
                  onFinish={onFinish}
                  form={form}
                  labelCol={{
                    span: 6,
                    offset: 0,
                  }}
                >
                  <Form.Item name="email" label="Email">
                    <Input disabled defaultValue={myInfo.email} />
                  </Form.Item>

                  <Form.Item
                    label="Name"
                    style={{ marginBottom: 0 }}
                    wrapperCol={{
                      span: 20,
                    }}
                  >
                    <Form.Item
                      name="first_name"
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 8px)',
                      }}
                      rules={[
                        { required: true, message: 'Please input first name!' },
                      ]}
                    >
                      <Input
                        placeholder="Input First name"
                        value={myInfo?.first_name}
                      />
                    </Form.Item>
                    <Form.Item
                      name="last_name"
                      rules={[{ required: true, message: 'Please last name!' }]}
                      style={{
                        display: 'inline-block',
                        width: 'calc(50% - 0px)',
                        margin: '0 0 0 8px',
                      }}
                    >
                      <Input
                        placeholder="Input last name"
                        value={myInfo?.last_name}
                      />
                    </Form.Item>
                  </Form.Item>
                  {myInfo?.role === USER_ROLE.Student && (
                    <Form.Item
                      name="student_id"
                      label="Student ID"
                      rules={[
                        {
                          required: true,
                          message: 'Student ID is required',
                        },
                        {
                          min: 0,
                          max: 10,
                        },
                      ]}
                    >
                      <Input placeholder="Update student ID" />
                    </Form.Item>
                  )}
                  <Form.Item name="gender" label="Gender">
                    <Select placeholder="Select your gender">
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Form>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default EditProfileModal;
