"use client";

import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import { handleFirestoreError, OperationType } from "@/lib/firestore-errors";

const INITIAL_GAMES = [
  {
    id: "pubgm",
    name: "PUBG Mobile",
    slug: "pubgm",
    logoLight: "/images/games/pubgm_black.png",
    logoDark: "/images/games/pubgm_white.png",
    developer: "Level Infinite",
  },
  {
    id: "bgmi",
    name: "Battlegrounds Mobile India",
    slug: "bgmi",
    parentGameId: "pubgm",
    logoLight: "/images/games/bgmi_black.png",
    logoDark: "/images/games/bgmi_white.png",
    developer: "Krafton",
  },
  {
    id: "hok",
    name: "Honor of Kings",
    slug: "hok",
    logoLight: "/images/games/hok_black.png",
    logoDark: "/images/games/hok_white.png",
    developer: "TiMi Studio Group",
  },
  {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    slug: "mlbb",
    logoLight: "/images/games/mlbb_black.png",
    logoDark: "/images/games/mlbb_white.png",
    developer: "Moonton",
  },
  {
    id: "moba5v5",
    name: "Moba Legends: 5v5",
    slug: "moba5v5",
    parentGameId: "mlbb",
    logoLight: "/images/games/ml5_black.png",
    logoDark: "/images/games/ml5_white.png",
    developer: "Moonton",
  },
  {
    id: "valo",
    name: "Valorant",
    slug: "valo",
    logoLight: "/images/games/valo_black.png",
    logoDark: "/images/games/valo_white.png",
    developer: "Riot Games",
  },
  {
    id: "ff",
    name: "Free Fire",
    slug: "ff",
    logoLight: "/images/games/ff_black.png",
    logoDark: "/images/games/ff_white.png",
    developer: "Garena",
  },
  {
    id: "ffm",
    name: "Free Fire Max",
    slug: "ffm",
    parentGameId: "ff",
    logoLight: "/images/games/ffm_black.png",
    logoDark: "/images/games/ffm_white.png",
    developer: "Garena",
  }
];

export default function AdminInitGamesPage() {
  const { user, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSeed = async () => {
    if (!user) {
      setStatus("You must be logged in as an admin.");
      return;
    }

    setLoading(true);
    setStatus("Seeding games...");

    try {
      for (const game of INITIAL_GAMES) {
        const { id, ...gameData } = game;
        await setDoc(doc(db, "games", id), {
          ...gameData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setStatus("Successfully seeded all 8 games!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "games");
      setStatus("Error seeding games. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading auth...</div>;

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Admin: Initialize Games</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        This will seed the database with the 8 core games (PUBGM, BGMI, HOK, MLBB, MOBA5v5, VALO, FF, FFM) and link their light/dark mode logos.
      </p>

      {!user ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
          Please sign in using the button in the header first. Your email must be caballero.bhanu@gmail.com to have admin rights.
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? "Seeding..." : "Seed Initial Games"}
          </button>
          
          {status && (
            <div className="mt-4 rounded-lg bg-neutral-100 p-4 text-sm dark:bg-neutral-900">
              {status}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
