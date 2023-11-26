import { RiseOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';

export default function ClassCard(props: {
  classId: string;
  title: string;
  description: string;
  avatarSrc: string;
  coverImageSrc: string;
  index: number;
}) {
  const navigate = useNavigate();

  const onCardClick = () => {
    navigate(`/class/${props.classId}/news`);
  };

  return (
    <Card
      onClick={() => {
        onCardClick();
      }}
      bordered
      hoverable
      style={{ width: 300 }}
      cover={<img alt="Class cover" src={props.coverImageSrc} />}
    >
      <Meta
        avatar={<Avatar src={props.avatarSrc} />}
        title={props.title}
        description={props.description}
      />
    </Card>
  );
}
