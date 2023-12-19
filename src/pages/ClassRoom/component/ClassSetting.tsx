import { Form, Modal, Divider, Input, Switch, App } from 'antd';

import { useParams } from 'react-router';

import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';
import { useUpdateClass } from '@/app/store/server/features/classroom/mutations';

interface ClassSettingProps extends Partial<ClassDTO> {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function ClassSetting({
  open,
  setOpen,
  name,
  description,
  isJoinable,
}: ClassSettingProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { id: classId } = useParams();

  const { isPending, mutate } = useUpdateClass();
  const handleSubmit = (values: any) => {
    mutate(
      { ...values, classId },
      {
        onSuccess() {
          setOpen(false);
          return message.success('Update class successfully!');
        },
        onError() {
          return message.error('Update class failed!');
        },
      }
    );
  };

  return (
    <Modal
      destroyOnClose
      centered
      open={open}
      onOk={() => form.submit()}
      okText="Save"
      onCancel={() => setOpen(false)}
      confirmLoading={isPending}
    >
      <h3 className="text-center">Class Setting</h3>
      <Divider className="m-0 mb-4 p-0" />

      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ name, description, isJoinable }}
      >
        <Form.Item label="Class Name" name="name">
          <Input placeholder="Input Class Name" />
        </Form.Item>

        <Form.Item label="Class Description" name="description">
          <Input.TextArea
            placeholder="Input class description"
            maxLength={100}
            showCount
          />
        </Form.Item>
        <Form.Item
          label="Toggle Class Joinable"
          name="isJoinable"
          tooltip="Turn on or turn off for allowing student to join class through code or public link"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ClassSetting;
