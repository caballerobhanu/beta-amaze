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
    setLogs(["Starting bulk image migration to Firebase Storage..."]);

    try {
      const gamesSnap = await getDocs(collection(db, "games"));
      const games = gamesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      
      addLog(`Found ${games.length} games in database.`);

      for (const game of games) {
        const updates: any = {};
        
        // Helper function to process image
        const processImage = async (imageUrl: string, suffix: string) => {
          if (imageUrl && (imageUrl.startsWith('/images/') || imageUrl.startsWith('data:image/'))) {
            try {
              addLog(`[${game.id}] Processing ${suffix} logo...`);
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              
              const storageRef = ref(storage, `games/${game.id}_${suffix}.png`);
              addLog(`[${game.id}] Uploading to Firebase Storage...`);
              await uploadBytes(storageRef, blob);
              
              const downloadUrl = await getDownloadURL(storageRef);
              return downloadUrl;
            } catch (e: any) {
              addLog(`[${game.id}] Error with ${suffix}: ${e.message}`);
              return null;
            }
          }
          return null;
        };

        const lightUrl = await processImage(game.logoLight, 'light');
        if (lightUrl) updates.logoLight = lightUrl;

        const darkUrl = await processImage(game.logoDark, 'dark');
        if (darkUrl) updates.logoDark = darkUrl;

        if (Object.keys(updates).length > 0) {
          addLog(`[${game.id}] Updating Firestore document...`);
          await updateDoc(doc(db, "games", game.id), updates);
          addLog(`[${game.id}] Document updated.`);
        } else {
          addLog(`[${game.id}] No local/base64 images to migrate.`);
        }
      }

      addLog("Migration complete! All images are now in Firebase Storage.");
    } catch (error: any) {
      addLog(`Fatal Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading auth...</div>;

  return (
    <div className="container mx-auto max-w-3xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Admin: Bulk Migrate to Firebase Storage</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">
        Now that Firebase Storage is initialized, this tool will automatically grab all the Base64/local images currently in your database, upload them to your Firebase Storage bucket, and update the database with the new fast CDN URLs. You only need to click this once!
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
            {loading ? "Migrating..." : "Start Bulk Migration"}
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
