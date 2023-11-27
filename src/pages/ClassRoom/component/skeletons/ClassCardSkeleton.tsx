import { Card, Skeleton } from 'antd';

function ClassCardSkeleton() {
  return (
    <Card
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
      className="w-full"
    >
      <Skeleton active avatar paragraph={{ rows: 1 }} />
    </Card>
  );
}

export default ClassCardSkeleton;
