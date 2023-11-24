import { MoreOutlined } from '@ant-design/icons';
import { Avatar, Card, MenuProps, Dropdown, Space } from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';

export default function MemberCard(props: { email: string; avatar: string }) {
  return (
    // <Card
    // bordered={false} >
    //   <Meta
    //     // style={{marginBottom: "2rem"}}
    //     className="text-lg"
    //     avatar={
    //       <Avatar src={'https://xsgames.co/randomusers/avatar.php?g=pixel'} />
    //     }
    //     title={'h1'}
    //   />
    // </Card>
    <div className="flex flex-row p-5 gap-x-5 text-base">
      <div className="">
        <Avatar src={props.avatar} />
      </div>
      <div className="grow items-center align-middle">
        <span className="inline-block align-middle w-full text-left">
          {props.email}
        </span>
      </div>
      <div className="">
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <MoreOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
const items: MenuProps['items'] = [
  {
    label: <a href="javascript:void(0)">Copy Code</a>,
    key: '0',
  },
  {
    type: 'divider',
  },
  {
    label: <a href="javascript:void(0)">Edit Code</a>,
    key: '1',
  },
];
