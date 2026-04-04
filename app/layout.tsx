import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'EsportsAmaze | The Modern Esports Database',
  description: 'A modern, stylish, and efficient esports database covering multiple titles, tournaments, teams, and players.',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-white bg-pattern font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-950/60">
              <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="relative h-6 w-32">
                      <Image
                        src="/images/esportsamaze_long_default.png"
                        alt="EsportsAmaze"
                        fill
                        className="object-contain dark:hidden"
                        priority
                      />
                      <Image
                        src="/images/esportsamaze_long_white.png"
                        alt="EsportsAmaze"
                        fill
                        className="hidden object-contain dark:block"
                        priority
                      />
                    </div>
                  </Link>
                  <nav className="hidden md:flex gap-6">
                    <Link href="/games" className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">Games</Link>
                    <Link href="/tournaments" className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">Tournaments</Link>
                    <Link href="/teams" className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">Teams</Link>
                    <Link href="/players" className="text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">Players</Link>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button className="flex h-8 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Sign In
                  </button>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-neutral-200 py-6 md:py-0 dark:border-neutral-800">
              <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row md:px-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-6 w-32">
                    <Image
                      src="/images/esportsamaze_long_default.png"
                      alt="EsportsAmaze"
                      fill
                      className="object-contain dark:hidden opacity-60 hover:opacity-100 transition-opacity"
                    />
                    <Image
                      src="/images/esportsamaze_long_white.png"
                      alt="EsportsAmaze"
                      fill
                      className="hidden object-contain dark:block opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-center text-sm leading-loose text-neutral-600 dark:text-neutral-400 md:text-left">
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
