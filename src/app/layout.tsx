import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-sans-thai',
});

export const metadata: Metadata = {
  title: 'SMO Sci-Tech',
  description: 'สโมสรนักศึกษาคณะวิทยาศาสตร์และเทคโนโลยี',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning className={`${notoSansThai.variable}`}>
      <body className={`${notoSansThai.className} antialiased bg-black text-white min-h-screen flex flex-col font-sans`}>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
