'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-[1.3rem] font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-[0.82rem] text-[#606060] mb-6">{error.message || 'An unexpected error occurred.'}</p>
          <button onClick={reset}
            className="px-5 py-2 rounded-lg bg-white text-[#0a0a0a] font-bold text-[0.82rem] hover:bg-white/85 transition-colors">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
