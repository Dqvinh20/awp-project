import ClassCard from '@/components/Card/ClassCard';
import {
  EditOutlined,
  EllipsisOutlined,
  RiseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Avatar, Card, FloatButton } from 'antd';
import Meta from 'antd/es/card/Meta';

const classList = [
  {
    title: 'Lớp Vinh là giáo viên',
    description: 'Dương Quang Vinh',
    avatarSrc: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    coverImageSrc:
      'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  },
  {
    title: 'Lớp Quan là giáo viên',
    description: 'Dương Quang Vinh',
    avatarSrc: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    coverImageSrc:
      'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  },
  {
    title: 'Lớp Quan là giáo viên',
    description: 'Dương Quang Vinh',
    avatarSrc: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    coverImageSrc:
      'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  },
  {
    title: 'Lớp Quan là giáo viên',
    description: 'Dương Quang Vinh',
    avatarSrc: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    coverImageSrc:
      'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  },
  {
    title: 'Lớp Quan là giáo viên',
    description: 'Dương Quang Vinh',
    avatarSrc: 'https://xsgames.co/randomusers/avatar.php?g=pixel',
    coverImageSrc:
      'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  },
];
function HomePage() {
  return (
    <div className="w-full flex flex-wrap gap-x-6 gap-y-6">
      {classList.map((myclass, index) => (
        <ClassCard
          key={`class-component-${index}`}
          title={myclass.title}
          description={myclass.description}
          avatarSrc={myclass.avatarSrc}
          coverImageSrc={myclass.coverImageSrc}
        />
      ))}
    </div>
  );
}

export default HomePage;
