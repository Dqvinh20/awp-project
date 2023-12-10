import { Form } from 'antd';

import { EditableContext } from './context';
import { GradeTableDataType } from './interfaces';

export interface EditableRowProps {
  index: number;
  initialValues: GradeTableDataType;
}

const EditableRow: React.FC<EditableRowProps> = ({
  index,
  initialValues = {},
  ...props
}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} initialValues={initialValues}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export default EditableRow;
