import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SMO Club | สโมสรนักศึกษา',
  description: 'สโมสรนักศึกษา — แสดงผลงาน สมาชิก และประกาศข่าวสารของเรา',
  keywords: 'สโมสรนักศึกษา, SMO, Phuket Rajabhat University',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${geist.className} bg-[#0a0a0a] text-white min-h-screen`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
