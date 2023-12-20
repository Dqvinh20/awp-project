import Icon, {
  GroupOutlined,
  HomeOutlined,
  LoadingOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { MenuProps, Spin } from 'antd';
import { NavLink } from 'react-router-dom';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useClassesQuery } from '@/app/store/server/features/classroom/queries';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';
import GraduationCap from '@/assets/graduation-cap.png';
import Lecture from '@/assets/lecture.png';
import QuoteRequest from '@/assets/quote-request.png';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export function useAdminSideMenuItems(): MenuProps['items'] {
  // const {
  //   isLoading: profileLoading,
  //   isSuccess: profileSuccess,
  //   data: profile,
  // } = useGetMyInfo();
  // const { isLoading, isError, data: classes } = useClassesQuery();

  // const loadInnerMenu = (): MenuItem[] => {
  //   if (isLoading && profileLoading)
  //     return [
  //       getItem(
  //         <div className="flex justify-center">
  //           <Spin
  //             indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
  //           />
  //         </div>,
  //         'loading'
  //       ),
  //     ];
  //   if (isError) return [];
  //   if (!profileSuccess) return [];

  //   const icon =
  //     profile.role === USER_ROLE.Teacher ? (
  //       <Icon
  //         id="lecture-icon"
  //         alt={'Teaching'}
  //         component={() => (
  //           <img
  //             src={Lecture}
  //             alt={'Teaching'}
  //             style={{
  //               width: '1em',
  //             }}
  //           />
  //         )}
  //       />
  //     ) : (
  //       <Icon
  //         id="graduation-cap-icon"
  //         alt={'GraduationCap'}
  //         component={() => (
  //           <img
  //             src={GraduationCap}
  //             alt={'GraduationCap'}
  //             style={{
  //               width: '1em',
  //             }}
  //           />
  //         )}
  //       />
  //     );

  //   // Role based
  //   return [
  //     profile.role === USER_ROLE.Teacher
  //       ? getItem(
  //           <NavLink to={'pending-reviews'}>Pending reviews</NavLink>,
  //           'pending-reviews',
  //           <Icon
  //             id="pending-reviews-icon"
  //             alt={'Quote Request Icon'}
  //             component={() => (
  //               <img
  //                 src={QuoteRequest}
  //                 alt={'Quote Request Icon'}
  //                 style={{
  //                   width: '1em',
  //                 }}
  //               />
  //             )}
  //           />
  //         )
  //       : null,
  //     getItem(
  //       profile.role === USER_ROLE.Teacher ? 'Lectures' : 'Enrolled',
  //       'classes',
  //       icon,
  //       classes?.docs.map((c) =>
  //         getItem(
  //           <NavLink to={`class/${c.id}/news`}>{c.name}</NavLink>,
  //           `class/${c.id}`
  //         )
  //       )
  //     ),
  //   ];
  // };

  return [
    getItem(
      <NavLink to={'accounts'}>Accounts Manager</NavLink>,
      'admin/accounts',
      <UserOutlined />
    ),
    getItem(
      <NavLink to={'classes'}>Classes Manager</NavLink>,
      'admin/classes',
      <Icon
        id="lecture-icon"
        alt={'Classes'}
        component={() => (
          <img
            src={Lecture}
            alt={'Classes'}
            style={{
              width: '1em',
            }}
          />
        )}
      />
    ),
  ];
}
