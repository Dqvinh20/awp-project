import { Skeleton, Space } from 'antd';

function ClassMemberSkeleton() {
  return (
    <Space>
      <Skeleton.Avatar active size="large" shape="circle" />
      <Skeleton.Input active size="large" block />
    </Space>
  );
}

export default ClassMemberSkeleton;
