import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Github',
    href: 'https://github.com/ry-animal/lit-protocol-next',
    external: true,
  },
  {
    label: 'Vercel',
    href: 'https://lit-protocol-next.vercel.app/',
    external: true,
  },
];

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white font-mono">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex gap-4 text-xl font-bold">
            <Image src="/lit.svg" alt="Lit Swap" width={40} height={40} />
            Genius Limit Order
          </div>
          <nav className="flex space-x-4 md:gap-10">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-500 transition-colors duration-300"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-gray-500 transition-colors duration-300"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
