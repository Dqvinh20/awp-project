import { Card, Skeleton } from 'antd';

function ClassCardSkeleton() {
  return (
    <Card
      style={{ width: 300 }}
      bordered
      hoverable
      cover={
        <Skeleton.Image
          className="!h-40"
          style={{
            width: '100%',
          }}
          active={true}
        />
      }
    >
      <Skeleton active avatar paragraph={{ rows: 1 }} />
    </Card>
  );
}

export default ClassCardSkeleton;
