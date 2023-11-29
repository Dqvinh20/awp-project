import { Dropdown, MenuProps, App } from 'antd';

import { MoreOutlined } from '@ant-design/icons';

import BannerClass from './BannerClass';

import useClassDetail from '@/hooks/useClassDetail';

// const baseUrl = import.meta.env.DEV
//   ? 'http://localhost:4200'
//   : 'https://awp_project.hausuper-s.me';

export default function ClassRoom() {
  const { message } = App.useApp();

  const { data, isSuccess } = useClassDetail();

  if (!data) return null;

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            navigator.clipboard.writeText(data.public_invitation_link ?? '');
            message.success('Copy Link Success');
          }}
        >
          Copy public invitation link
        </div>
      ),
      key: 'linkjoin',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div
          onClick={() => {
            navigator.clipboard.writeText(data.code);
            message.success('Copy Code Success');
          }}
        >
          Copy class code
        </div>
      ),
      key: 'copycode',
    },
  ];
  return (
    isSuccess && (
      <div className="h-full w-full flex justify-center bg-slate-50 pt-6">
        <div className="flex flex-col justify-center items-center h-fit w-full px-2 sm:w-11/12 lg:w-4/5 sm:px-0">
          <BannerClass title={data.name} />
          <div className="twp flex flex-row gap-x-3 pt-3 md:pt-6 w-full">
            <div className="hidden sm:block bg-white rounded-lg border border-gray-300 p-4 w-1/3">
              <div className="flex flex-row justify-between items-center">
                <span className="text-base font-bold">Class Code</span>
                <Dropdown
                  menu={{ items }}
                  arrow
                  placement="bottomLeft"
                  trigger={['click']}
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="text-gray-600 hover:text-gray-600 hover:bg-gray-300 hover:rounded-full flex items-center justify-center p-2"
                  >
                    <MoreOutlined
                      style={{ fontSize: '24px', color: 'inherit' }}
                    />
                  </a>
                </Dropdown>
              </div>
              <div className="text-2xl mt-2 text-[rgb(25,103,210)]">
                {data.code}
              </div>
            </div>
            <div className="w-full bg-white rounded-lg border border-gray-300 flex items-center px-5 py-5">
              {data.description && (
                <span className="hidden md:inline-block">
                  Class Description
                </span>
              )}
              <div className="text-left text-base">
                {data.description ?? 'No description'}
              </div>
            </div>
            {/* <div className="bg-white flex flex-col rounded-md border-solid border-2 border-slate-300">
              <div className="flex flex-row ">
                <div className="text-left grow text-base">Class Code</div>
                <div className="text-center items-center text-base ">
                  <Dropdown
                    menu={{ items }}
                    arrow
                    placement="bottomLeft"
                    trigger={['click']}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <MoreOutlined />
                    </a>
                  </Dropdown>
                </div>
              </div>
              <div className="text-left text-3xl mt-2 ">{data.code}</div>
            </div>
            <div className="grow p-5 bg-white rounded-md border-solid border-2 border-slate-300 items-center">
              <div className="text-left text-base  h-full">
                {data.description}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  );
}
