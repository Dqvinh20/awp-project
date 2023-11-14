import { useEffect, useState } from 'react';

import HeaderDesktopNav from './Header/DesktopNav';
import HeaderMobileNav from './Header/MobileNav';

import BrandLogo from '@/components/BrandLogo';

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
          <div className="shrink-0 mr-4">
            <BrandLogo />
          </div>

          <HeaderDesktopNav />

          <HeaderMobileNav />
        </div>
      </div>
    </header>
  );
}

export default Header;
