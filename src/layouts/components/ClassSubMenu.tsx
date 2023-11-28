import { useQuery } from '@tanstack/react-query';
import { Menu } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { useClassesQuery } from '@/app/store/server/features/classroom/queries';

export default function ClassSubMenu() {
  const { isLoading, data, isError, error } = useClassesQuery();
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <div>Error + {error.message}</div>;
  return (
    <SubMenu className="text-" key="sub1" title={'Class'}>
      {data?.docs?.map((myclass, index) => (
        <Menu.Item className="" key={myclass.name} style={{ float: 'right' }}>
          <NavLink to={`class/${myclass.id}/news`}>{myclass.name}</NavLink>
        </Menu.Item>
      ))}
    </SubMenu>
  );
}
