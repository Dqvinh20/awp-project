/* eslint-disable max-lines-per-function */
import { Form, Input, InputNumber, InputRef } from 'antd';
import { RefObject, useContext, useEffect, useRef, useState } from 'react';

import { Rule } from 'antd/es/form';

import { EditableContext } from './context';
import { Item } from './interfaces';

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  type: 'number' | 'string';
  rules?: Rule[];
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  type = 'number',
  rules = [],
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef =
    type === 'number' ? useRef<HTMLInputElement>(null) : useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      /* Empty */
    }
  };

  const renderInput = () => {
    if (type === 'number') {
      return (
        <Form.Item
          className="w-[110px]"
          style={{ margin: 0, padding: 0 }}
          name={dataIndex}
          rules={[...rules]}
        >
          <InputNumber
            placeholder="Please input number"
            ref={inputRef as RefObject<HTMLInputElement>}
            size="middle"
            onPressEnter={save}
            onBlur={save}
            addonAfter="/10"
          />
        </Form.Item>
      );
    }

    return (
      <Form.Item
        className="w-[100%]"
        style={{ margin: 0, padding: 0 }}
        name={dataIndex}
        rules={[...rules]}
      >
        <Input
          placeholder="Please input text"
          ref={inputRef as RefObject<InputRef>}
          size="middle"
          onPressEnter={save}
          onBlur={save}
        />
      </Form.Item>
    );
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      renderInput()
    ) : (
      <div
        className="editable-cell-value-wrap align-middle"
        style={
          type === 'number'
            ? { paddingRight: 16 }
            : {
                whiteSpace: 'nowrap',
                maxWidth: 200,
              }
        }
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
