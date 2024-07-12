import React from 'react';
import Image from 'next/image';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Github', href: '' },
  { label: 'Vercel', href: '/services' },
];

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white font-mono">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-3 text-xl font-bold">
            <Image src="/lit.svg" alt="Lit Swap" width={40} height={40} />
            Genius Swap
          </div>
          <nav className="flex space-x-4 md:gap-10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-gray-500 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
