import {
  HomeOutlined,
  LoadingOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { MenuProps, Spin } from 'antd';
import { NavLink } from 'react-router-dom';

import { useGetMyInfo } from '@/app/store/server/features/users/queries';
import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

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

export function useSideMenu(): MenuProps['items'] {
  const { data: myInfo } = useGetMyInfo();
  const { isLoading, isError } = useClassesQuery();

  const loadInnerMenu = (): MenuItem[] => {
    if (isLoading)
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

    return [getItem('Enrolled', 'enrolled')];
  };

  return [
    getItem(<NavLink to={'home'}>Home</NavLink>, 'home', <HomeOutlined />),
    { type: 'divider' },
    ...loadInnerMenu(),
    { type: 'divider' },
    getItem('Setting', 'setting', <SettingOutlined />),
  ];
}
