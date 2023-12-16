import { CSSProperties, HTMLAttributes, memo } from 'react';

import { Collapse, CollapseProps, theme } from 'antd';

import { CaretRightOutlined } from '@ant-design/icons';

import { StudentGradeReviewDto } from '@/app/store/server/features/grade_review/interfaces';
import {
  GradeColumn,
  GradeRow,
} from '@/app/store/server/features/class_grade/interfaces';

interface StudentGradeReviewItemProps
  extends Partial<StudentGradeReviewDto>,
    HTMLAttributes<HTMLDivElement> {
  gradeColumns?: GradeColumn[];
  gradeRows?: GradeRow[];
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function StudentGradeReviewItem({
  gradeColumns = [],
  gradeRows = [],
  column: columnId,
  review_reason,
  expected_grade,
  ...rest
}: StudentGradeReviewItemProps) {
  const { token } = theme.useToken();
  const colName = gradeColumns.find((col) => col.id === columnId)?.name;
  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (
    panelStyle
  ) => [
    {
      key: colName,
      label: colName,
      children: <p>{text}</p>,
      style: panelStyle,
    },
  ];

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      //   style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
}

export default memo(StudentGradeReviewItem);
