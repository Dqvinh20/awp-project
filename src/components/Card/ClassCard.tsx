import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, CardProps } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';

import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';

interface ClassCardProps extends CardProps, Omit<ClassDTO, 'id'> {
  classId: string;
  customCoverImg?: string;
  isTeacher?: boolean;
  isOwner?: boolean;
}

const teacherCoverImgs = [
  'https://www.gstatic.com/classroom/themes/img_reachout.jpg',
  'https://www.gstatic.com/classroom/themes/img_billiard.jpg',
];

const studentCoverImgs = [
  'https://www.gstatic.com/classroom/themes/img_learnlanguage.jpg',
  'https://www.gstatic.com/classroom/themes/img_graduation.jpg',
];

function ClassCard({
  classId,
  name,
  description,
  owner,
  customCoverImg = undefined,
  isOwner = false,
  isTeacher = false,
}: ClassCardProps) {
  const navigate = useNavigate();

  const onCardClick = () => {
    navigate(`/class/${classId}/news`);
  };

  const coverImg = () => {
    if (customCoverImg) return customCoverImg;

    if (isTeacher) {
      if (isOwner) {
        return teacherCoverImgs[1];
      }
      return teacherCoverImgs[0];
    }

    if (isOwner) {
      return studentCoverImgs[1];
    }

    return studentCoverImgs[0];
  };

  return (
    <Card
      onClick={() => {
        onCardClick();
      }}
      bordered
      hoverable
      className="w-full"
      cover={<img alt="Class cover" src={coverImg()} />}
    >
      {isOwner ? (
        <Meta title={name} description={description} />
      ) : (
        <Meta
          avatar={<Avatar src={owner.avatar} icon={<UserOutlined />} />}
          title={name}
          description={description}
        />
      )}
    </Card>
  );
}

export default ClassCard;
