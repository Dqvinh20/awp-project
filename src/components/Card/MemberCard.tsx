import { MoreOutlined } from '@ant-design/icons';
import { Avatar, MenuProps, Dropdown, Flex, Space } from 'antd';

import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { USER_ROLE, User } from '@/app/store/server/features/users/interfaces';
import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import useClassDetail from '@/hooks/useClassDetail';
import {
  useRemoveMembers,
  useLeaveClass,
} from '@/app/store/server/features/classroom/mutations';

interface MemberCardProps extends Partial<User> {
  id?: string;
  isOwner?: boolean;
  isStudent?: boolean;
  isTeacher?: boolean;
  className?: string;
}

// eslint-disable-next-line max-lines-per-function
export default function MemberCard({
  id,
  email,
  avatar,
  isOwner = false,
  className = 'text-base px-4 h-[52px] md:h-[64px]',
  isStudent = false,
  isTeacher = false,
}: MemberCardProps) {
  const { data: myData } = useGetMyInfo();
  const { data: classDetail } = useClassDetail();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: leaveClassMutate } = useLeaveClass();
  const { mutate: removeMemberMutate } = useRemoveMembers();

  // Check if render myself
  const isMySelf = myData?.email === email;

  // Check if i am owner
  const isClassOwner = classDetail?.owner.id === myData?.id;

  // Check if i am teacher
  const isClassTeacher = classDetail?.teachers?.some(
    (teacher) => teacher.id === myData?.id
  );

  const onItemClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'remove-student': {
        removeMemberMutate(
          {
            class_id: classDetail?.id as string,
            users_id: id ? [id] : [],
            role: USER_ROLE.Student,
          },
          {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ['class', classDetail?.id as string],
                exact: true,
              });
              queryClient.invalidateQueries({
                queryKey: ['classes'],
              });
            },
          }
        );
        break;
      }
      case 'remove-teacher': {
        removeMemberMutate(
          {
            class_id: classDetail?.id as string,
            users_id: id ? [id] : [],
            role: USER_ROLE.Teacher,
          },
          {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ['class', classDetail?.id as string],
                exact: true,
              });
              queryClient.invalidateQueries({
                queryKey: ['classes'],
              });
            },
          }
        );
        break;
      }
      case 'leave-class': {
        leaveClassMutate(classDetail?.id as string, {
          onSuccess() {
            navigate('/home', { replace: true });
            queryClient.removeQueries({
              queryKey: ['class', classDetail?.id as string],
            });
            queryClient.invalidateQueries({
              queryKey: ['classes'],
            });
          },
        });
        break;
      }
      default:
        break;
    }
  };

  const menuItemsBuilder = (): MenuProps['items'] => {
    // If i am owner, i can kick student and remove teacher
    if (isClassOwner) {
      if (isStudent) {
        return [
          {
            label: 'Remove Student',
            key: 'remove-student',
            danger: true,
          },
        ];
      }
      return [
        {
          label: 'Remove Teacher',
          key: 'remove-teacher',
          danger: true,
        },
      ];
    }

    // If i am teacher, i can kick student and leave class
    if (isClassTeacher) {
      if (isStudent) {
        return [
          {
            label: 'Remove Student',
            key: 'remove-student',
            danger: true,
          },
        ];
      }
      return [
        {
          label: 'Leave Class',
          key: 'leave-class',
          danger: true,
        },
      ];
    }

    // If i am student, i can leave class
    return [
      {
        label: 'Leave Class',
        key: 'leave-class',
        danger: true,
      },
    ];
  };

  const dropDownRender = () => {
    if (isOwner) {
      return;
    }

    // If render teacher card and i am not owner
    if (isTeacher && !isClassOwner) {
      // And i am not a teacher in class
      if (!isClassTeacher) {
        // Not show dropdown
        return;
      }

      // Then am a teacher in class and i am currently rendering another teacher card
      if (!isMySelf) {
        // Not show dropdown
        return;
      }
    }

    // If i am a student in class
    const isClassStudent = !isClassTeacher && !isClassOwner;

    // If render student card
    // And i am student in class and i am currently rendering another student card
    if (isStudent && isClassStudent && !isMySelf) {
      // Not show dropdown
      return;
    }

    // Show dropdown
    return (
      <Dropdown
        menu={{ items: menuItemsBuilder(), onClick: onItemClick }}
        arrow
        trigger={['click']}
        placement="bottomRight"
      >
        <button className="twp hover:bg-blue-50 rounded-full w-[32px] h-[32px] flex justify-center items-center">
          <MoreOutlined className="text-inherit text-[22px]" />
        </button>
      </Dropdown>
    );
  };

  return (
    <Flex className={className} align="center" justify="start" gap={'middle'}>
      <Flex flex={1} justify="start">
        <Space align="center" size="middle">
          <Avatar className="hidden sm:block w-[32px] h-[32px]" src={avatar} />
          <span className="font-semibold leading-5">{email} </span>
        </Space>
      </Flex>
      {dropDownRender()}
    </Flex>
  );
}
