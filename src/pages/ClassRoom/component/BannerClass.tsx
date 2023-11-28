import { Tooltip } from 'antd';
import React from 'react';
import 'react-banner/dist/style.css';

interface BannerClassProps {
  bgImg?: string;
  title: string;
}

export default function BannerClass({
  bgImg = 'https://gstatic.com/classroom/themes/img_graduation.jpg',
  title,
}: BannerClassProps) {
  return (
    <div
      className="w-full h-32 sm:h-60 rounded-lg bg-cover bg-center bg-no-repeat text-white object-cover flex flex-col-reverse px-4"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <Tooltip title={title} placement="bottom">
        <p className="line-clamp-1 sm:line-clamp-1 text-base md:text-xl lg:text-4xl font-medium">
          {title}
        </p>
      </Tooltip>
    </div>
  );
}
