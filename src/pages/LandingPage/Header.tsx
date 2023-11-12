import { useEffect, useState } from 'react';

function Header() {
  const [top, setTop] = useState<boolean>(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    setTop(window.scrollY <= 10);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? 'bg-white backdrop-blur-sm shadow-lg' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">{<h1>LOGO</h1>}</div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <a
                  href="/sign-in"
                  className="font-medium text-gray-500 hover:text-gray-950 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Sign in
                </a>
              </li>
              <li>
                <a
                  href="/sign-up"
                  className="px-4 py-2 rounded flex items-center justify-center btn-sm text-gray-200 hover:text-gray-200 bg-gray-900 hover:bg-gray-700 ml-3"
                >
                  <span>Sign up</span>
                  <svg
                    className="w-3 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                      fillRule="nonzero"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
