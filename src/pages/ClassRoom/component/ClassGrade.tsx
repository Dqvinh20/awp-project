import { Button, Col, Form, Input, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

export default function ClassGrade() {
  const [categoryGrade, setCategoryGrade] = useState([
    { id: '123', name: '1', percentage: '2' },
    { id: '232', name: '3', percentage: '4' },
    { id: '312', name: '5', percentage: '6' },
  ]);
  const [form] = Form.useForm();
  const handleDragDrop = (results: any) => {
    const { source, destination, type } = results;
    console.log(source, destination, type);
    if (!destination) return;
    if (
      source.droppableId == destination.droppableId &&
      source.index == destination.index
    )
      return;
    if (type == 'group') {
      const itemCopy = [...categoryGrade];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;
      const [removedStore] = itemCopy.splice(sourceIndex, 1);

      itemCopy.splice(destinationIndex, 0, removedStore);
      form.setFieldsValue({
        category: itemCopy,
      });
    }
  };
  const onFinish = (values: any) => {
    console.log(values);
  };
  const onFormLayoutChange = (categories: any) => {
    var category = form.getFieldValue('category');
    console.log(category)
    var categoryGradeCopy = [...categoryGrade];

    // console.log(categories.category)
    // for( let i=0;i < categories.category.length; i++){
    //   console.log(categories.category[i])
    // }
    // setCategoryGrade(newValue);
  };
  if (!categoryGrade) return;
  return (
    <div className="w-full bg-white h-full text-center flex flex-row justify-center pt-6">
      <div className="flex flex-col justify-center items-center w-1/2 h-fit">
        <h3 className="w-full text-left text-xl font-bold m-0">Loại điểm</h3>
        <span className="w-full text-left">Loại điểm phải có tổng là 100%</span>
        <Form
          form={form}
          onFinish={onFinish}
          className="w-full p-5"
          onValuesChange={onFormLayoutChange}
        >
          <DragDropContext onDragEnd={handleDragDrop}>
            <Droppable droppableId="ROOT" type="group">
              {(provided: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categoryGrade.map((category: any, index) => (
                    <Draggable
                      draggableId={category.id}
                      key={category.id}
                      index={index}
                    >
                      {(provided: any, snapshot: any) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <Row className="gap-x-5 h-fit">
                            {/* <span>{category.id}</span> */}
                            <Form.Item
                                hidden
                                name={['category', index, 'id']}
                                initialValue={category.id}
                              >
                            </Form.Item>
                            <Col span={8}>
                              <Form.Item
                                label="Grade Category"
                                name={['category', index, 'name']}
                                initialValue={category.name}
                              >
                                <Input placeholder="input Category" />
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item
                                label="Percentage"
                                name={['category', index, 'percentage']}
                                initialValue={category.percentage}
                              >
                                <Input placeholder="input Percentage" />
                              </Form.Item>
                            </Col>
                          </Row>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
const store = [
  {
    id: 'AAA',
  },
  {
    id: 'BBB',
  },
  {
    id: 'CCC',
  },
];
