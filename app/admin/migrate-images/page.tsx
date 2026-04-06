"use client";

import { useState } from "react";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";

export default function MigrateImagesPage() {
  const { user, isAuthReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
  };

  const handleMigrate = async () => {
    if (!user) {
      addLog("Error: You must be logged in as an admin.");
      return;
    }

    setLoading(true);
    setLogs(["Starting image migration to Firebase Storage..."]);

    try {
      const gamesSnap = await getDocs(collection(db, "games"));
      const games = gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      
      addLog(`Found ${games.length} games in database.`);

      for (const game of games) {
        const updates: any = {};
        
        // Process logoLight
        if (game.logoLight && game.logoLight.startsWith('/images/')) {
          try {
            addLog(`[${game.id}] Fetching ${game.logoLight}...`);
            const response = await fetch(game.logoLight);
            if (!response.ok) throw new Error(`Failed to fetch ${game.logoLight}`);
            const blob = await response.blob();
            
            const storageRef = ref(storage, `games/${game.id}_light.png`);
            addLog(`[${game.id}] Uploading to Firebase Storage...`);
            await uploadBytes(storageRef, blob);
            
            const downloadUrl = await getDownloadURL(storageRef);
            updates.logoLight = downloadUrl;
            addLog(`[${game.id}] Successfully uploaded logoLight.`);
          } catch (e: any) {
            addLog(`[${game.id}] Error with logoLight: ${e.message}`);
          }
        }

        // Process logoDark
        if (game.logoDark && game.logoDark.startsWith('/images/')) {
          try {
            addLog(`[${game.id}] Fetching ${game.logoDark}...`);
            const response = await fetch(game.logoDark);
            if (!response.ok) throw new Error(`Failed to fetch ${game.logoDark}`);
            const blob = await response.blob();
            
            const storageRef = ref(storage, `games/${game.id}_dark.png`);
            addLog(`[${game.id}] Uploading to Firebase Storage...`);
            await uploadBytes(storageRef, blob);
            
            const downloadUrl = await getDownloadURL(storageRef);
            updates.logoDark = downloadUrl;
            addLog(`[${game.id}] Successfully uploaded logoDark.`);
          } catch (e: any) {
            addLog(`[${game.id}] Error with logoDark: ${e.message}`);
          }
        }

        if (Object.keys(updates).length > 0) {
          addLog(`[${game.id}] Updating Firestore document...`);
          await updateDoc(doc(db, "games", game.id), updates);
          addLog(`[${game.id}] Document updated.`);
        } else {
          addLog(`[${game.id}] No local images to migrate.`);
        }
      }

      addLog("Migration complete!");
    } catch (error: any) {
      addLog(`Fatal Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading auth...</div>;

  return (
    <div className="container mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Admin: Migrate Images to Firebase Storage</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        This tool will download the local images (from /public/images/...) currently used by the games in the database, upload them to Firebase Storage, and update the database with the new secure, fast CDN URLs.
      </p>

      {!user ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
          Please sign in using the button in the header first. Your email must be caballero.bhanu@gmail.com to have admin rights.
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? "Migrating..." : "Start Migration"}
          </button>
          
          <div className="rounded-lg bg-neutral-950 p-4 font-mono text-sm text-green-400 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <span className="text-neutral-500">Waiting to start...</span>
            ) : (
              logs.map((log, i) => <div key={i}>{log}</div>)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
