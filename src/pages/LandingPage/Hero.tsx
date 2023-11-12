import { Parallax } from 'rc-scroll-anim';

function Hero() {
  return (
    <section className="relative h-screen">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}

          <div className="text-center pb-12 md:pb-16">
            <Parallax
              animation={[{ opacity: 0, playScale: [0.8, 1] }]}
              style={{ opacity: 1 }}
            >
              <h1
                className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
                data-aos="zoom-y-out"
              >
                Awesome Web{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                  classroom
                </span>
              </h1>
            </Parallax>
            <div className="max-w-3xl mx-auto">
              <Parallax
                animation={[{ opacity: 0, playScale: [0.7, 1] }]}
                style={{ opacity: 1 }}
              >
                <p
                  className="text-xl text-gray-600 mb-8"
                  data-aos="zoom-y-out"
                  data-aos-delay="150"
                >
                  A advanced online classroom for students and teachers.
                </p>
              </Parallax>
              <Parallax
                animation={[{ opacity: 0, playScale: [0.6, 1] }]}
                style={{ opacity: 1 }}
              >
                <div
                  className="max-w-full grid grid-rows-2 sm:mx-auto sm:max-w-none sm:flex sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay="300"
                >
                  <div>
                    <a
                      className="block w-full mb-4  px-6 py-3 rounded btn text-white hover:text-white bg-blue-600 hover:bg-blue-700 sm:w-auto sm:mb-0"
                      href="#0"
                    >
                      Start free trial
                    </a>
                  </div>
                  <div>
                    <a
                      className="block w-full px-6 py-3 rounded btn text-white hover:text-white bg-gray-900 hover:bg-gray-800 sm:w-auto sm:ml-4"
                      href="#0"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </Parallax>
            </div>
          </div>
          <div style={{ height: '145px' }}></div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
