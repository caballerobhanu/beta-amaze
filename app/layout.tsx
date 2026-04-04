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
            <main className="flex-1">{children}</main>
            
            <footer className="border-t border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-950/50">
              {/* Sub-footer Navigation */}
              <div className="container mx-auto px-4 py-8 md:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div className="flex flex-col space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Games</h4>
                    <Link href="/games" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">All Titles</Link>
                    <Link href="/games/pubg-mobile" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">PUBG Mobile</Link>
                    <Link href="/games/valorant" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Valorant</Link>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Tournaments</h4>
                    <Link href="/tournaments" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Ongoing</Link>
                    <Link href="/tournaments/upcoming" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Upcoming</Link>
                    <Link href="/tournaments/results" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Results</Link>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Teams</h4>
                    <Link href="/teams" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Pro Teams</Link>
                    <Link href="/teams/rankings" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Rankings</Link>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Players</h4>
                    <Link href="/players" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Pro Players</Link>
                    <Link href="/players/transfers" className="text-sm text-neutral-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400">Transfers</Link>
                  </div>
                </div>
              </div>

              {/* Main Footer */}
              <div className="border-t border-neutral-200 py-6 dark:border-neutral-800">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-8">
                  <div className="flex items-center">
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
