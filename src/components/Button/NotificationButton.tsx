/* eslint-disable max-lines-per-function */
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  List,
  Skeleton,
  Space,
  theme,
} from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';

import { useEffect, useState } from 'react';

import BellSvg from '../Svg/Bell';

const { useToken } = theme;

interface DataType {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  nat: string;
}

function NotificationButton() {
  const [count, setCount] = useState(100);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      'https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo'
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const random = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    // const timeout = setTimeout(() => {
    //   setCount((prev) => prev + 1);
    // }, 200);
    // return () => clearTimeout(timeout);
  }, [count]);
  const { token } = useToken();
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      dropdownRender={(menu) => (
        <div style={contentStyle}>
          <div
            className="absolute right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-20"
            style={{ width: '20rem' }}
          >
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
              <InfiniteScroll
                className="py-2"
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                {/* <a
                  href="#"
                  className="flex items-center px-4 py-3 border-b hover:bg-gray-100 -mx-2"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover mx-1"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                    alt="avatar"
                  />
                  <p className="text-gray-600 text-sm mx-2">
                    <span className="font-bold" href="#">
                      Sara Salah
                    </span>{' '}
                    replied on the{' '}
                    <span className="font-bold text-blue-500" href="#">
                      Upload Image
                    </span>{' '}
                    artical . 2m
                  </p>
                </a> */}
                <List
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item key={item.email}>
                      <List.Item.Meta
                        avatar={<Avatar src={item.picture.large} />}
                        title={
                          <a href="https://ant.design">{item.name.last}</a>
                        }
                        description={item.email}
                      />
                      <div>Content</div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
              <a
                href="#"
                className="block bg-gray-800 text-white text-center font-bold py-2"
              >
                See all notifications
              </a>
            </div>
          </div>
        </div>
      )}
    >
      <Badge
        className={count > 99 ? 'mr-2' : ''}
        count={count}
        overflowCount={999}
        color="cyan"
        offset={[0, 0]}
      >
        <button
          className={`relative min-w-[32px] w-[32px] h-[32px] flex justify-center z-4 items-center rounded-full bg-white focus:outline-none border border-gray-300 hover:border-gray-600`}
        >
          <BellSvg />
        </button>
      </Badge>
    </Dropdown>
  );
}

export default NotificationButton;
