/* eslint-disable max-lines-per-function */
// import {
//   App,
//   Avatar,
//   Button,
//   Descriptions,
//   DescriptionsProps,
//   Form,
//   Input,
//   List,
//   Space,
//   Spin,
//   Switch,
//   Tag,
//   Tooltip,
// } from 'antd';
// import dayjs from 'dayjs';

// import { useState } from 'react';

// import ErrorPage from '@/pages/ErrorPage';

// import { User } from '@/app/store/server/features/users/interfaces';
// import { getUserFullNameOrEmail } from '@/utils/index';
// import { useUpdateClass } from '@/app/store/server/features/classroom/mutations';
// import DocumentTitle from '@/components/DocumentTitle';

// function AccountDetail() {
//   const { message } = App.useApp();
//   const [form] = Form.useForm();
//   const isActiveWatch = Form.useWatch('isActive', form);
//   const [editing, setEditing] = useState(false);

//   const { data, isLoading, isSuccess, isError, error } = useClassDetail();
//   const { mutate: updateClassMutate, isPending } = useUpdateClass();

//   if (isLoading) {
//     return (
//       <div className="h-full flex justify-center items-center p-6">
//         <Spin />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="h-full flex justify-center items-center p-6">
//         <ErrorPage error={error} />
//       </div>
//     );
//   }

//   const handleUpdateClass = (values: UpdateClassDTO) => {
//     updateClassMutate(
//       {
//         classId: data?.id,
//         isActive: values.isActive,
//         name: values.name,
//         description: values.description,
//       },
//       {
//         onSuccess() {
//           setEditing(false);
//           message.success('Updated class successfully');
//         },
//         onError() {
//           message.error('Updated class failed');
//         },
//       }
//     );
//   };

//   const items = ({
//     student_id,
//     full_name,
//     email,
//     avatar,
//     role,
//     gender,
//     created_at,
//     isActive,
//   }: User): DescriptionsProps['items'] => [
//     {
//       key: '1',
//       label: 'ID',
//       children: !editing ? (
//         student_id
//       ) : (
//         <Form.Item name="student_id">
//           <Input />
//         </Form.Item>
//       ),
//     },
//     {
//       key: '2',
//       label: 'Name',
//       children: !editing ? (
//         full_name
//       ) : (
//         <Form.Item name="full_name">
//           <Input.TextArea showCount maxLength={500} />
//         </Form.Item>
//       ),
//     },
//     {
//       key: '6',
//       label: 'Status',
//       children: !editing ? (
//         <Tag color={isActive ? 'green' : 'red'}>
//           {isActive ? 'Active'.toUpperCase() : 'inactive'.toUpperCase()}
//         </Tag>
//       ) : (
//         <Form.Item name="isActive">
//           <Switch
//             className={`${
//               isActiveWatch ?? isActive ? '!bg-green-500' : '!bg-red-500'
//             }`}
//             checkedChildren="Active"
//             unCheckedChildren="Inactive"
//           />
//         </Form.Item>
//       ),
//     },

//     {
//       key: '7',
//       label: 'Email',
//       children: (
//         <Space>
//           <Tooltip title={`Mail to ${email}`}>
//             <a className="" href={`mailto:${email}`}>
//               {email}
//             </a>
//           </Tooltip>
//         </Space>
//       ),
//       span: 2,
//     },
//     {
//       key: '5',
//       label: 'Created At',
//       children: dayjs(created_at).format('L LT'),
//     },
//     {
//       key: '8',
//       label: 'Role',
//       children: role,
//     },
//     {
//       key: '9',
//       label: 'Gender',
//       children: !editing ? (
//         gender
//       ) : (
//         <Form.Item name="gender">
//           <Input.TextArea showCount maxLength={500} />
//         </Form.Item>
//       ),
//     },
//   ];

//   return (
//     isSuccess && (
//       <>
//         <DocumentTitle title={data.full_name} />
//         <div className="h-full p-6">
//           <Form form={form} initialValues={data} onFinish={handleUpdateClass}>
//             <Descriptions
//               layout="vertical"
//               title="Class Info"
//               size={'middle'}
//               items={items(data)}
//               extra={
//                 <Space>
//                   {editing ? (
//                     <>
//                       <Button
//                         type="primary"
//                         loading={isPending}
//                         onClick={() => {
//                           form.validateFields().then(() => form.submit());
//                         }}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         type="default"
//                         disabled={isPending}
//                         onClick={() => {
//                           setEditing(false);
//                           form.resetFields();
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   ) : (
//                     <Button
//                       type="primary"
//                       onClick={() => {
//                         setEditing(true);
//                       }}
//                     >
//                       Edit
//                     </Button>
//                   )}
//                 </Space>
//               }
//             />
//           </Form>
//         </div>
//       </>
//     )
//   );
// }

// export default AccountDetail;
