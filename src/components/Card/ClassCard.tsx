import { RiseOutlined } from '@ant-design/icons';
import { Avatar, Card, FloatButton } from 'antd';
import Meta from 'antd/es/card/Meta';
import React from 'react';

export default function ClassCard(props: {
  title: string;
  description: string;
  avatarSrc: string;
  coverImageSrc: string;
}) {
  return (
    <Card
      bordered
      hoverable
      className="text-sm border-slate-300"
      size="small"
      style={{ width: 300 }}
      cover={
        <img
          className="border-slate-300"
          //   style={{height: "100px",objectFit: "cover"}}
          alt="cover image"
          src={props.coverImageSrc}
        />
      }
      actions={[
        <FloatButton
          icon={<RiseOutlined title="Mở sổ điểm của lớp" key="grade1" />}
        />,
        <RiseOutlined title={`Mở sổ điểm cho "${props.title}"`} key="grade" />,
      ]}
    >
      <Meta
        // style={{marginBottom: "2rem"}}
        avatar={<Avatar src={props.avatarSrc} />}
        title={props.title}
        description={props.description}
      />
    </Card>
  );
}
