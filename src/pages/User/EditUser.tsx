/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {} from '@ant-design/icons';
import { Button, Cascader, Form, Input, Select, CascaderProps } from 'antd';

import Swal from 'sweetalert2';

import { useQueryClient } from '@tanstack/react-query';

import useAuth from '@/hooks/useAuth';
import {
  useGetMyInfo,
  useGetUser,
} from '@/app/store/server/features/users/queries';
import userService from '@/services/UserService';

export default function EditUser() {
  const { id } = useParams();
  const { user_id } = useAuth();
  const [form] = Form.useForm();
  const [componentDisabled] = useState<boolean>(user_id !== id);

  useGetMyInfo();

  const { isLoading, data, isError, error } = useGetUser(id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.full_name,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data?.gender,
        street: data.address ? data.address[0]?.street : '',
        postal_code: data.address ? data.address[0]?.postal_code : '',
        'address-more': '..',
        Address: data.address
          ? [
              data.address[0]?.country,
              data.address[0]?.city,
              data.address[0]?.state,
            ]
          : [],
      });
    }
  }, [data, form]);

  // const mutation = useUpdateUser()

  const onFinish = async (values: any) => {
    // mutation.mutateAsync({userId:id,formdata:values})
    const formData = { ...values };

    formData.address = [
      {
        country: formData.Address[0],
        city: formData.Address[1],
        state: formData.Address[2],
        postal_code: formData.postal_code,
        street: formData.street,
      },
    ];

    try {
      await userService.updateUser({ id, ...formData });
      await queryClient.invalidateQueries({
        queryKey: ['user', 'me'],
      });
      Swal.fire({
        title: 'Success!',
        text: "Update user's profile successfully!",
        icon: 'success',
      });
    } catch (apiError: any) {
      Swal.fire({
        title: 'Error!',
        text: apiError.response.data.message[0],
        icon: 'error',
      });
    }
  };

  if (isError) {
    Swal.fire({
      title: 'Error!',
      text: 'Can not get data',
      icon: 'error',
    });
    return <div>Error + {error.message}</div>;
  }

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className="flex justify-center py-16 w-full">
      <div className="w-3/6">
        <div className="flex flex-col">
          <h2 className="text-center mb-5">Edit profile</h2>
          <Form
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            disabled={componentDisabled}
            onFinish={onFinish}
            form={form}
            style={{ maxWidth: 1440 }}
          >
            <Form.Item label="Name" style={{ marginBottom: 0 }}>
              <Form.Item
                name="first_name"
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                rules={[
                  { required: true, message: 'Please input first name!' },
                ]}
              >
                <Input placeholder="Input First name" />
              </Form.Item>
              <Form.Item
                name="last_name"
                rules={[{ required: true, message: 'Please last name!' }]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <Input placeholder="Input last name" value={data?.last_name} />
              </Form.Item>
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select gender!' }]}
            >
              <Select placeholder="Select your gender">
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="Address"
              label="Address"
              rules={[
                {
                  type: 'array',
                  required: true,
                  message: 'Please select your address!',
                },
              ]}
            >
              <Cascader placeholder="Chose address" options={residences} />
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: 'Please input address!' }]}
              label="Street"
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                name="street"
                style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                rules={[{ required: true, message: 'Input street name !' }]}
              >
                <Input placeholder="Input street name" />
              </Form.Item>
              {/* <Form.Item
                name="postal_code"
                rules={[
                  { required: true, message: 'Please input postal_code!' },
                ]}
                style={{
                  display: 'inline-block',
                  width: 'calc(50% - 8px)',
                  margin: '0 8px',
                }}
              >
                <Input placeholder="Input postal_code" />
              </Form.Item> */}
            </Form.Item>
            <Form.Item label=" " colon={false}>
              <Button type="primary" htmlType="submit">
                Edit
              </Button>

              <Button
                className="ml-2"
                onClick={() => {
                  window.history.back();
                }}
              >
                Back
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const residences: CascaderProps<DataNodeType>['options'] = [
  {
    value: 'Viet Nam',
    label: 'Viet Nam',
    children: [
      {
        value: 'TPHCM',
        label: 'TPHCM',
        children: [
          {
            value: 'Quan 1',
            label: 'Quan 1',
          },
          {
            value: 'Quan 2',
            label: 'Quan 2',
          },
          {
            value: 'Quan 3',
            label: 'Quan 3',
          },
          {
            value: 'Quan 4',
            label: 'Quan 4',
          },
        ],
      },
    ],
  },
];
