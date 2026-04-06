"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

interface Game {
  id: string;
  name: string;
  slug: string;
  logoLight?: string;
  logoDark?: string;
  developer?: string;
  parentGameId?: string;
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "games"));
        const gamesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];
        // Filter out variant/child games to keep the main grid clean
        setGames(gamesData.filter((game) => !game.parentGameId));
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.GET, "games");
        } catch (e: any) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Games
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Browse our database of esports titles.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 dark:border-neutral-800 dark:border-t-red-500"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
          Error loading games: {error}
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <p className="text-neutral-600 dark:text-neutral-400">No games found. An admin needs to seed the games database.</p>
          <Link href="/admin/init-games" className="mt-4 inline-block text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
            Go to Admin Tools
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/10 dark:border-neutral-800 dark:bg-black dark:hover:shadow-red-500/20"
            >
              {/* Background glow effect on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-10 dark:from-red-500/20"></div>
              
              <div className="relative flex h-20 w-full flex-1 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                {/* Light mode: White background, White logo (logoDark). Drop shadow makes it flushed/embossed. */}
                {game.logoDark && (
                  <Image
                    src={game.logoDark}
                    alt={game.name}
                    fill
                    className="pointer-events-none object-contain drop-shadow-md dark:hidden"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('image-failed');
                    }}
                  />
                )}
                {/* Dark mode: Black background, Black logo (logoLight). */}
                {game.logoLight && (
                  <Image
                    src={game.logoLight}
                    alt={game.name}
                    fill
                    className="pointer-events-none hidden object-contain drop-shadow-md dark:block"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('image-failed');
                    }}
                  />
                )}
                <span className="pointer-events-none font-display text-4xl font-black text-white drop-shadow-md dark:text-black absolute inset-0 flex items-center justify-center opacity-0 [.image-failed_&]:opacity-100 transition-opacity">
                  {game.name.substring(0, 2).toUpperCase()}
                </span>
                {!game.logoLight && !game.logoDark && (
                  <span className="pointer-events-none font-display text-4xl font-black text-white drop-shadow-md dark:text-black absolute inset-0 flex items-center justify-center">
                    {game.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="mt-6 flex w-full flex-col items-center text-center">
                <h3 className="font-display text-lg font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                  {game.name}
                </h3>
                {game.developer && (
                  <p className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {game.developer}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
