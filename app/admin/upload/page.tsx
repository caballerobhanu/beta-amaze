"use client";

import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/components/firebase-provider";
import Image from "next/image";

export default function AdminUploadPage() {
  const { user, isAuthReady } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!user) {
      setError("You must be logged in to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (err) => {
          setError(`Upload failed: ${err.message}. Did you enable Firebase Storage in the console?`);
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadUrl);
          setUploading(false);
          setFile(null);
        }
      );
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      alert("URL copied to clipboard!");
    }
  };

  if (!isAuthReady) return <div className="p-8">Loading auth...</div>;

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl p-8">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200">
          Please sign in using the button in the header first. You must be an admin.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:px-8">
      <h1 className="mb-6 font-display text-3xl font-black tracking-tight sm:text-4xl">Upload Images</h1>
      
      <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
        <h2 className="mb-2 font-bold text-blue-800 dark:text-blue-200">⚠️ Firebase Storage Setup Required</h2>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          If you get a <strong>"retry-limit-exceeded"</strong> or <strong>"unauthorized"</strong> error, it means Firebase Storage is not initialized in your project yet.
        </p>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="font-bold underline">Firebase Console</a>.</li>
          <li>Select your project.</li>
          <li>Click <strong>Storage</strong> in the left menu, then click <strong>Get Started</strong>.</li>
          <li>Choose <strong>Start in test mode</strong> (or update your rules to allow read/write).</li>
          <li>Click <strong>Done</strong>. Come back here and try uploading again!</li>
        </ol>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-500 file:mr-4 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100 dark:text-neutral-400 dark:file:bg-red-900/30 dark:file:text-red-400"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full rounded-full bg-red-600 px-4 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
        >
          {uploading ? `Uploading... ${progress}%` : "Upload Image"}
        </button>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {url && (
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-900/20">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-green-800 dark:text-green-200">Upload Successful!</p>
                <button 
                  onClick={copyToClipboard}
                  className="rounded-full bg-green-200 px-3 py-1 text-xs font-bold text-green-800 hover:bg-green-300 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                >
                  Copy URL
                </button>
              </div>
              <p className="mt-2 break-all font-mono text-xs text-green-600 dark:text-green-400">{url}</p>
            </div>
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-black">
              <Image src={url} alt="Uploaded preview" fill className="object-contain p-4" unoptimized />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
