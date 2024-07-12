import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  console.log('test');
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
        Hello Genius
      </div>
    </main>
  );
}
