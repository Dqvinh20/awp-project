import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Cascader,
  Form,
  Input,
  Modal,
  Select,
  CascaderProps,
} from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassRoom } from '@/app/store/server/features/classroom/interfaces';
import ClassRoomService from '@/services/ClassService';

export default function CreateClassModal(props: {
  open: boolean;
  setOpen: Function;
}) {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const queryClient = useQueryClient()
  const createClassRoomMutation = useMutation<ClassRoom[]>({
    mutationFn: (data:any) => ClassRoomService.saveClassRoom(data),
    onSuccess: (newClassRoom:any) =>{
      console.log("onSuccess :",newClassRoom)

      if(newClassRoom.success){
        queryClient.invalidateQueries({ queryKey: ['classes'] })
        
      }
    },
    onError:(error)=>{
      console.log("Error :",error)
    }
  });
 

  const handlesubmit =  async (values: any) => {
    setConfirmLoading(true);
    createClassRoomMutation.mutate(values)
  };
  const handleCancel = () => {
    props.setOpen(false);
  };
  useEffect(()=>{
    props.setOpen(false);
    setConfirmLoading(false);
  },[createClassRoomMutation.isSuccess])
  return (
    <Modal
      title="Create Class"
      open={props.open}
      onOk={()=>form.submit()}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <div className="">
        <Form 
            form={form}
            onFinish={handlesubmit}>
          <Form.Item
            rules={[{ required: true, message: 'Please input class name!' }]}
            label="Class Name"
            name="class_name"
            style={{ marginBottom: 0 }}
          >
            <Input
              placeholder="Input Class Name"
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
