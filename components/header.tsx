"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/80 dark:supports-[backdrop-filter]:bg-neutral-950/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          {!isHome && (
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
          )}
        </div>

        {!isHome && (
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="h-8 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-neutral-900"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="flex h-8 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
