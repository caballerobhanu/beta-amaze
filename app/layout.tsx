import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'EsportsAmaze | The Modern Esports Database',
  description: 'Beta Website covering multiple titles, tournaments, teams and players across Indian eSports.',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-white font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div suppressHydrationWarning className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-white dark:bg-neutral-950">{children}</main>
            
            <footer className="border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/50">
              {/* Sub-footer Navigation */}
              <div className="w-full border-b border-neutral-200 dark:border-neutral-800">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-200 dark:divide-neutral-800">
                  <Link href="/games" className="flex h-20 items-center justify-center bg-white text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all hover:bg-blue-600 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500">
                    Games
                  </Link>
                  <Link href="/tournaments" className="flex h-20 items-center justify-center bg-white text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all hover:bg-blue-600 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500">
                    Tournaments
                  </Link>
                  <Link href="/teams" className="flex h-20 items-center justify-center bg-white text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all hover:bg-blue-600 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500">
                    Teams
                  </Link>
                  <Link href="/players" className="flex h-20 items-center justify-center bg-white text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all hover:bg-blue-600 hover:text-white dark:bg-neutral-900 dark:text-white dark:hover:bg-blue-500">
                    Players
                  </Link>
                </div>
              </div>

              {/* Main Footer */}
              <div className="py-6">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
                  <div className="flex items-center">
                    <div className="relative h-8 w-44">
                      <Image
                        src="/images/esportsamaze_long_default.png"
                        alt="EsportsAmaze"
                        fill
                        unoptimized
                        className="object-contain dark:hidden"
                      />
                      <Image
                        src="/images/esportsamaze_long_white.png"
                        alt="EsportsAmaze"
                        fill
                        unoptimized
                        className="hidden object-contain dark:block"
                      />
                    </div>
                  </div>
                  <p className="text-center text-sm leading-loose text-neutral-600 dark:text-neutral-400 md:text-right">
                    Built for the community. © {new Date().getFullYear()} EsportsAmaze.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
