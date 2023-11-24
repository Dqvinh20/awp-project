import React from 'react';
import BannerClass from './BannerClass';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useGetDetailClass from '@/hooks/useGetDetailClass';
import { Dropdown, MenuProps, Space } from 'antd';
import { DownOutlined, MoreOutlined } from '@ant-design/icons';

export default function ClassRoom() {
  const { isLoading, data, isError, error } = useGetDetailClass();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <div>Error + {error.message}</div>;
  return (
    <div className="h-full text-center flex flex-col justify-start bg-slate-50">
      <div className="flex flex-col justify-center items-center w-full h-fit mt-2">
        <BannerClass title={data.name} />
        <div className="flex flex-row w-3/5 mt-5 gap-x-3">
          <div className="w-1/5  bg-white flex flex-col rounded-md border-solid border-2 border-slate-300 p-5 ">
            <div className="flex flex-row ">
              <div className="text-left grow text-base">Class Code</div>
              <div className="text-center items-center text-base ">
                <Dropdown menu={{ items }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <MoreOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>
            <div className="text-left text-3xl mt-2 ">{data.code}</div>
          </div>
          <div className="grow p-5 bg-white rounded-md border-solid border-2 border-slate-300 items-center">
            <div className="text-left text-base h-full">
              {data.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const items: MenuProps['items'] = [
  {
    label: <a href='javascript:void(0)'>Copy Code</a>,
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: <a href='javascript:void(0)'>Edit Code</a>,
    key: '1',
  },
];