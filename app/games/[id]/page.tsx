"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
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

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [variants, setVariants] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameAndVariants = async () => {
      try {
        // Fetch main game
        const docRef = doc(db, "games", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setGame({ id: docSnap.id, ...docSnap.data() } as Game);
          
          // Fetch variants (games where parentGameId == id)
          const variantsQuery = query(collection(db, "games"), where("parentGameId", "==", id));
          const variantsSnap = await getDocs(variantsQuery);
          const variantsData = variantsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Game[];
          setVariants(variantsData);
        } else {
          setGame(null);
        }
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.GET, `games/${id}`);
        } catch (e: any) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGameAndVariants();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-red-600 dark:border-neutral-800 dark:border-t-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
          Error loading game: {error}
        </div>
      </div>
    );
  }

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 lg:py-24">
      <Link href="/games" className="mb-8 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to games
      </Link>
      
      <div className="mb-12 flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="relative mb-6 h-32 w-48 md:mb-0">
          {game.logoDark && (
            <Image
              src={game.logoDark}
              alt={game.name}
              fill
              className="object-contain drop-shadow-md dark:hidden"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {game.logoLight && (
            <Image
              src={game.logoLight}
              alt={game.name}
              fill
              className="hidden object-contain drop-shadow-md dark:block"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        <div>
          <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            {game.name}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Database for {game.name} tournaments, teams, and players.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Tournaments</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Browse recent and upcoming tournaments.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Teams</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Explore team rosters and statistics.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="font-display text-xl font-bold">Players</h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Find player profiles and achievements.</p>
        </div>
      </div>

      {variants.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Regional Variants & Editions</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {variants.map((variant) => (
              <Link
                key={variant.id}
                href={`/games/${variant.id}`}
                className="group relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10 dark:border-neutral-800 dark:bg-black dark:hover:shadow-red-500/20"
              >
                <div className="relative flex h-16 w-full flex-1 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  {variant.logoDark && (
                    <Image
                      src={variant.logoDark}
                      alt={variant.name}
                      fill
                      className="object-contain drop-shadow-md dark:hidden"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('image-failed');
                      }}
                    />
                  )}
                  {variant.logoLight && (
                    <Image
                      src={variant.logoLight}
                      alt={variant.name}
                      fill
                      className="hidden object-contain drop-shadow-md dark:block"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('image-failed');
                      }}
                    />
                  )}
                  <span className="font-display text-2xl font-black text-white drop-shadow-md dark:text-black absolute inset-0 flex items-center justify-center opacity-0 [.image-failed_&]:opacity-100 transition-opacity">
                    {variant.name.substring(0, 2).toUpperCase()}
                  </span>
                  {!variant.logoLight && !variant.logoDark && (
                    <span className="font-display text-2xl font-black text-white drop-shadow-md dark:text-black absolute inset-0 flex items-center justify-center">
                      {variant.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex w-full flex-col items-center text-center">
                  <h3 className="font-display text-sm font-bold tracking-tight text-neutral-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                    {variant.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
