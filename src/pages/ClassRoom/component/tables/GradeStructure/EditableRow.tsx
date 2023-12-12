import { Form } from 'antd';
import { CSS } from '@dnd-kit/utilities';

import { useSortable } from '@dnd-kit/sortable';
import React from 'react';
import { MenuOutlined } from '@ant-design/icons';

import { EditableContext } from './context';
import './index.css';
import { DataType } from './interfaces';

export interface EditableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  initialValues: DataType;
  'data-row-key': string;
}

const EditableRow: React.FC<EditableRowProps> = ({
  index,
  initialValues = {},
  children,
  className,
  ...props
}) => {
  const [form] = Form.useForm();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging && className !== 'ant-table-placeholder'
      ? { position: 'relative', zIndex: 9999 }
      : {}),
  };

  return (
    <Form form={form} component={false} initialValues={initialValues}>
      <EditableContext.Provider value={form}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
          {React.Children.map(children, (child) => {
            if ((child as React.ReactElement).props.dataIndex === 'sort') {
              return React.cloneElement(child as React.ReactElement, {
                children: (
                  <MenuOutlined
                    ref={setActivatorNodeRef}
                    style={{ touchAction: 'none', cursor: 'move' }}
                    {...listeners}
                  />
                ),
              });
            }
            return child;
          })}
        </tr>
      </EditableContext.Provider>
    </Form>
  );
};

export default EditableRow;
