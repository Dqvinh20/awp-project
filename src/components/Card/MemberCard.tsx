import { MoreOutlined } from '@ant-design/icons';
import { Avatar, MenuProps, Dropdown, Flex, Space } from 'antd';

import { User } from '@/app/store/server/features/users/interfaces';

const items: MenuProps['items'] = [
  {
    label: <a href="javascript::void(0)">Copy Code</a>,
    key: '0',
  },
  {
    type: 'divider',
    key: 'devider-o-o',
  },
  {
    label: <a href="javascript::void(0)">Edit Code</a>,
    key: '1',
  },
];

interface MemberCardProps extends Partial<User> {
  isOwner?: boolean;
  isStudent?: boolean;
  isTeacher?: boolean;
}

export default function MemberCard({
  email,
  avatar,
  isOwner = false,
  isStudent = false,
  isTeacher = false,
}: MemberCardProps) {
  // return (
  //   <div className="flex flex-row p-5 gap-x-5 text-base">
  //     <Avatar src={props.avatar} />
  //     {/* <div className="grow items-center align-middle">
  //       <span className="inline-block align-middle w-full text-left">
  //         {props.email}
  //       </span>
  //     </div> */}
  //     <Dropdown
  //       menu={{ items }}
  //       arrow
  //       trigger={['click']}
  //       placement="bottomRight"
  //     >
  //       <MoreOutlined />
  //     </Dropdown>
  //   </div>
  // );

  return (
    <Flex
      className="text-base p-3 sm:p-5"
      align="center"
      justify="start"
      gap={'middle'}
    >
      <Flex flex={1} justify="start">
        <Space align="center" size="middle">
          <Avatar className={'hidden sm:block'} src={avatar} />
          <span className="font-medium leading-5">{email} </span>
        </Space>
      </Flex>
      {!isOwner && (
        <Dropdown
          menu={{ items }}
          arrow
          trigger={['click']}
          placement="bottomRight"
        >
          <MoreOutlined />
        </Dropdown>
      )}
    </Flex>
  );
}
