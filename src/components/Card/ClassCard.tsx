/* eslint-disable max-lines-per-function */
import { MoreOutlined } from '@ant-design/icons';
import { CardProps, Dropdown, MenuProps, Space } from 'antd';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';

import { memo, useCallback } from 'react';

import { ClassDTO } from '@/app/store/server/features/classroom/interfaces';
import { useLeaveClass } from '@/app/store/server/features/classroom/mutations';

interface ClassCardProps extends CardProps, Omit<ClassDTO, 'id'> {
  classId: string;
  customCoverImg?: string;
  isTeacher?: boolean;
  isOwner?: boolean;
}

const teacherCoverImgs = [
  'https://www.gstatic.com/classroom/themes/img_reachout.jpg',
  'https://www.gstatic.com/classroom/themes/img_billiard.jpg',
];

const studentCoverImgs = [
  'https://www.gstatic.com/classroom/themes/img_learnlanguage.jpg',
  'https://www.gstatic.com/classroom/themes/img_graduation.jpg',
];

// const items: MenuProps['items'] = [
//   {
//     key: '1',
//     label: (
//       <a
//         target="_blank"
//         rel="noopener noreferrer"
//         href="https://www.antgroup.com"
//       >
//         1st menu item
//       </a>
//     ),
//   },
//   {
//     key: '2',
//     label: (
//       <a
//         target="_blank"
//         rel="noopener noreferrer"
//         href="https://www.aliyun.com"
//       >
//         2nd menu item (disabled)
//       </a>
//     ),
//     icon: <SmileOutlined />,
//     disabled: true,
//   },
//   {
//     key: '3',
//     label: (
//       <a
//         target="_blank"
//         rel="noopener noreferrer"
//         href="https://www.luohanacademy.com"
//       >
//         3rd menu item (disabled)
//       </a>
//     ),
//     disabled: true,
//   },
//   {
//     key: '4',
//     danger: true,
//     label: 'Unenroll',
//     onClick() {
//       console.log('a danger item clicked');
//     },
//   },
// ];

function ClassCard({
  classId,
  name,
  description,
  owner,
  customCoverImg = undefined,
  isOwner = false,
  isTeacher = false,
}: ClassCardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const leaveClass = useLeaveClass();

  const onCardClick = () => {
    navigate(`/class/${classId}/news`);
  };

  const coverImg = () => {
    if (customCoverImg) return customCoverImg;

    if (isTeacher) {
      if (isOwner) {
        return teacherCoverImgs[1];
      }
      return teacherCoverImgs[0];
    }

    if (isOwner) {
      return studentCoverImgs[1];
    }

    return studentCoverImgs[0];
  };

  const onLeaveClass = useCallback(() => {
    leaveClass.mutate(classId, {
      onSuccess() {
        return queryClient.invalidateQueries({
          predicate(query) {
            return (
              query.queryKey[0] === 'classes' ||
              query.queryKey[0] === 'notifications'
            );
          },
        });
      },
    });
  }, [classId, leaveClass, queryClient]);

  const items = (): MenuProps['items'] => {
    if (isOwner) {
      return [];
    }
    if (isTeacher) {
      return [
        {
          key: '1',
          danger: true,
          label: 'Leave class',
          onClick: onLeaveClass,
        },
      ];
    }
    return [
      {
        key: '1',
        danger: true,
        label: 'Unenroll',
        onClick: onLeaveClass,
      },
    ];
  };

  // return (
  //   <Card
  //     onClick={onCardClick}
  //     bordered
  //     hoverable
  //     className="w-full"
  //     cover={
  //       <>
  //         <img alt="Class cover" src={coverImg()} />
  //         {/* <div className="absolute w-fit top-0 right-0 "> */}
  //         <Dropdown
  //           className="absolute !w-[10%] top-0 right-0 text-white !flex justify-center"
  //           menu={{ items }}
  //           trigger={['click', 'hover']}
  //         >
  //           <Space>
  //             <MoreOutlined />
  //           </Space>
  //         </Dropdown>
  //         {/* </div> */}
  //       </>
  //     }
  //   >
  //     {isOwner ? (
  //       <Meta title={name} description={description} />
  //     ) : (
  //       <Meta
  //         avatar={<Avatar src={owner.avatar} icon={<UserOutlined />} />}
  //         title={name}
  //         description={description}
  //       />
  //     )}
  //   </Card>
  // );

  return (
    <div className="max-w-lg lg:h-[14rem] w-full bg-white border border-gray-200 rounded-lg shadow hover:drop-shadow-lg flex flex-col">
      <div
        className={`relative rounded-t-lg w-full`}
        style={{
          paddingTop: '25%',
          backgroundImage: `url(${coverImg()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {!isOwner && (
          <Dropdown
            overlayClassName="[&_ul]:!py-2"
            className="absolute top-0 right-0"
            menu={{ items: items() }}
            trigger={['click']}
          >
            <Space className="mr-1 mt-1 hover:bg-black hover:bg-opacity-20 rounded-full flex justify-center items-center w-[2rem] h-[2rem] md:p-6">
              <MoreOutlined
                className="text-white"
                style={{
                  fontSize: '1.5rem',
                }}
              />
            </Space>
          </Dropdown>
        )}
        {!isOwner && (
          <img
            className="absolute rounded-full w-[32px] md:w-[48px] lg:w-[56px] right-2 bottom-0 translate-y-[50%] hover:drop-shadow-lg"
            src={owner.avatar}
            alt="Class cover"
          />
        )}
      </div>
      <div
        className="p-5 h-full cursor-pointer [&_a]:hover:underline"
        onClick={onCardClick}
      >
        {isOwner ? (
          <Meta
            title={
              <span className="text-black hover:text-black hover:underline text-base">
                {name}
              </span>
            }
            description={description}
          />
        ) : (
          <Meta
            title={
              <span className="text-black hover:text-black hover:underline text-base">
                {name}
              </span>
            }
            description={description}
          />
        )}
      </div>
    </div>
  );
}

export default memo(ClassCard);
