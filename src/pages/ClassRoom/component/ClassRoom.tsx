import { Dropdown, MenuProps, App } from 'antd';

import { MoreOutlined } from '@ant-design/icons';

import BannerClass from './BannerClass';

import useClassDetail from '@/hooks/useClassDetail';
const baseUrl = import.meta.env.DEV
  ? 'http://localhost:4200'
  : 'https://awp_project.hausuper-s.me';

export default function ClassRoom() {
  const { message } = App.useApp();

  const { data, isSuccess } = useClassDetail();

  if (!data) return null;

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            // navigator.clipboard.writeText(
            //   `${baseUrl}/classes/join?c=${data.code}`
            // );
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
      <div className="h-full text-center flex flex-col justify-start bg-slate-50 pt-5">
        <div className="flex flex-col justify-center items-center w-full h-fit mt-2">
          <BannerClass title={data.name} />
          <div className="flex flex-row w-3/5 mt-5 gap-x-3">
            <div className="w-1/5  bg-white flex flex-col rounded-md border-solid border-2 border-slate-300 p-5 ">
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
            </div>
          </div>
        </div>
      </div>
    )
  );
}
