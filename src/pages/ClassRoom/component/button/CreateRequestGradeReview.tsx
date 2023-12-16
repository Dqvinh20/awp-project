/* eslint-disable max-lines-per-function */
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Modal,
  FloatButton,
  Form,
  InputNumber,
  Input,
  Select,
  App,
} from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { AxiosError } from 'axios';

import { useGetClassGrades } from '@/app/store/server/features/class_grade/queries';
import { CreateGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import { GradeColumn } from '@/app/store/server/features/class_grade/interfaces';
import { useCreateGradeReviewMutation } from '@/app/store/server/features/grade_review/mutations';

const { Option } = Select;

function CreateRequestGradeReview() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const { id: classId } = useParams();
  const { data: classGrade, isSuccess } = useGetClassGrades(classId);
  const { mutate: createGradeReview, isPending } =
    useCreateGradeReviewMutation();
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleOk = async () => {
    await form
      .validateFields()
      .then(() => {
        const data = form.getFieldsValue();
        createGradeReview(
          { ...data, class: classId },
          {
            onSuccess() {
              message.success('Create grade review successfully');
              handleCancel();
            },
            onError(error) {
              if (error instanceof AxiosError) {
                const errorMessage = error.response?.data.message;
                if (errorMessage) {
                  message.error(errorMessage);
                  return;
                }
              }
              message.error('Create grade review failed');
            },
          }
        );
      })
      .catch();
  };

  return (
    <>
      <FloatButton
        shape="circle"
        type="primary"
        tooltip={<div>Create grade review</div>}
        onClick={() => setOpen(true)}
        icon={<PlusOutlined />}
      />
      <Modal
        open={open}
        onCancel={handleCancel}
        okText="Create"
        onOk={handleOk}
        confirmLoading={isPending}
      >
        <div className="text-center flex flex-col items-center justify-center">
          <span className="text-base font-semibold">Create Grade Review</span>
          <Divider className="my-4" />
          {isSuccess && (
            <Form
              className="w-full"
              form={form}
              initialValues={
                {
                  class: classId,
                } as CreateGradeReviewDto
              }
              layout="vertical"
            >
              <Form.Item
                tooltip="What column do you want to make a grade review?"
                name="column"
                label="Grade Column"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select grade column" allowClear>
                  {classGrade.grade_columns.map((column: GradeColumn) => (
                    <Option value={column.id}>{column.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                tooltip="What grade are you expecting?"
                name="expected_grade"
                label="Expected Grade"
                wrapperCol={{ flex: 1 }}
                rules={[
                  { required: true, message: 'Expected Grade is required' },
                  {
                    type: 'number',
                    min: 0,
                    max: 10,
                    message: 'Expected Grade must be between 0 and 10',
                  },
                ]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                name="review_reason"
                label="Reason"
                tooltip="Why do you want to make a grade review?"
                rules={[{ required: true, message: 'Reason is required' }]}
              >
                <Input.TextArea
                  showCount
                  maxLength={500}
                  rows={6}
                  allowClear
                  placeholder="Input your reason"
                />
              </Form.Item>
            </Form>
          )}
        </div>
      </Modal>
    </>
  );
}

export default CreateRequestGradeReview;
