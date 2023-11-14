import { useState } from 'react';

function HeaderMobileNav() {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <div className="flex md:hidden">
      {/* Hamburger button */}
      <div className="cursor-pointer " onClick={() => setShowMenu(!showMenu)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M 3 5 A 1.0001 1.0001 0 1 0 3 7 L 21 7 A 1.0001 1.0001 0 1 0 21 5 L 3 5 z M 3 11 A 1.0001 1.0001 0 1 0 3 13 L 21 13 A 1.0001 1.0001 0 1 0 21 11 L 3 11 z M 3 17 A 1.0001 1.0001 0 1 0 3 19 L 21 19 A 1.0001 1.0001 0 1 0 21 17 L 3 17 z"></path>
        </svg>
      </div>
      {/* Mobile navigation */}
      {showMenu && (
        <div className="absolute top-full h-screen pb-16 z-20 left-0 w-full overflow-y-hidden bg-white">
          <ul className="px-5 py-2 grid grid-rows-2 gap-2">
            <li className="flex justify-center items-center">
              <a
                href="/sign-in"
                className="font-medium text-gray-500 hover:text-gray-950 transition duration-150 ease-in-out"
              >
                Sign in
              </a>
            </li>
            <li>
              <a
                href="/sign-up"
                className="px-4 py-3 rounded flex items-center justify-center text-gray-200 hover:text-gray-200 bg-gray-900 hover:bg-gray-700"
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
        </div>
      )}
    </div>
  );
}

export default HeaderMobileNav;
