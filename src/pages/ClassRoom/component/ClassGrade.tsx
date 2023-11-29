import React, { useCallback, useState } from 'react';
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

export default function ClassGrade() {
  return (
    <div className="w-full bg-white h-full text-center flex flex-row justify-center pt-6">
      <div className="flex flex-col justify-center items-center w-full h-fit">
        <h3 className='w-full text-left text-xl font-bold m-0'>Loại điểm</h3>
        <span className='w-full text-left'>Loại điểm phải có tổng là 100%</span>
        <DragDropContext
          onDragEnd={() => {
            console.log('drag end');
          }}
        >
          <Droppable droppableId="ROOT" type="group">
            {(provided: any) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {store.map((st: any, index) => (
                  <Draggable draggableId={st.id} key={st.id} index={index}>
                    {(provided: any, snapshot: any) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <span>{st.id}</span>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
