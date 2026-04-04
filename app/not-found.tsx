import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold text-neutral-200 dark:text-neutral-800">404</h1>
      <div className="mt-4 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Page not found</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
      </div>
      <div className="mt-10">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
