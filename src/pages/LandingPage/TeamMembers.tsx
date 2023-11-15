/* eslint-disable max-lines-per-function */
import { Parallax } from 'rc-scroll-anim';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import VinhAvatar from '@/assets/vinh_avatar.jpg';
import QuanAvatar from '@/assets/quan_avatar.jpg';
import ThongAvatar from '@/assets/thong_avatar.jpg';

const people = [
  {
    name: 'Trần Hồng Quân',
    role: 'Front End Developer',
    avatar: QuanAvatar,
    githubUrl: 'https://github.com/thq1706',
    animation: { x: 0, opacity: 1, playScale: [0, 0.4] },
    style: { transform: 'translateX(-100px)', opacity: 0 },
  },
  {
    name: 'Võ Minh Thông',
    role: 'Full Stack Developer',
    avatar: ThongAvatar,
    githubUrl: 'https://github.com/thong89x',
    animation: { y: 0, opacity: 1, playScale: [0, 0.4] },
    style: { transform: 'translateY(100px)', opacity: 0 },
  },
  {
    name: 'Dương Quang Vinh',
    role: 'Full Stack Developer',
    avatar: VinhAvatar,
    githubUrl: 'https://github.com/dqvinh20',
    animation: { x: 0, opacity: 1, playScale: [0, 0.4] },
    style: { transform: 'translateX(100px)', opacity: 0 },
  },
];

function TeamMembers() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <Parallax
            animation={[{ scale: 1, opacity: 1, playScale: [0, 0.4] }]}
            style={{
              opacity: 0,
              transform: 'scale(0)',
            }}
          >
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1 className="text-3xl font-bold mb-4">Team Members</h1>
            </div>
          </Parallax>

          <ul className="twp grid gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-y-16 xl:col-span-2">
            {people.map((person, index) => (
              <Parallax
                key={index}
                animation={person.animation}
                style={person.style}
              >
                <li>
                  <div className="flex items-center flex-col gap-x-6">
                    <div className="h-56 w-56 rounded-full">
                      <LazyLoadImage
                        src={person.avatar}
                        alt={person.name}
                        effect="blur"
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm font-semibold leading-6 text-gray-600">
                      {person.role}
                    </p>
                    <ul className="flex items-center justify-between mt-1">
                      <li>
                        <a
                          href={person.githubUrl}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-14 h-14 fill-current"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </Parallax>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default TeamMembers;
