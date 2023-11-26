import {
  HomeOutlined,
  LoadingOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MenuProps, Spin } from 'antd';
import { NavLink } from 'react-router-dom';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useClassesQuery } from '@/app/store/server/features/classroom/queries';
import { USER_ROLE } from '@/app/store/server/features/users/interfaces';

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

export function useSideMenuItems(): MenuProps['items'] {
  const {
    isLoading: profileLoading,
    isSuccess: profileSuccess,
    data: profile,
  } = useGetMyInfo();
  const { isLoading, isError, data: classes } = useClassesQuery();

  const loadInnerMenu = (): MenuItem[] => {
    if (isLoading && profileLoading)
      return [
        getItem(
          <div className="flex justify-center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>,
          'loading'
        ),
      ];
    if (isError) return [];
    if (!profileSuccess) return [];

    // Role based
    return [
      getItem(
        profile.role === USER_ROLE.Teacher ? 'Teaching' : 'Enrolled',
        'classes',
        null,
        classes?.docs.map((c) =>
          getItem(
            <NavLink to={`class/${c.id}/news`}>{c.name}</NavLink>,
            `class/${c.id}`
          )
        )
      ),
    ];
  };

  return [
    getItem(<NavLink to={'home'}>Home</NavLink>, 'home', <HomeOutlined />),
    { type: 'divider' },
    ...loadInnerMenu(),
    { type: 'divider' },
    getItem('Setting', 'setting', <SettingOutlined />),
  ];
}
