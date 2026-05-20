import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[5rem] font-extrabold text-white/[0.04] leading-none mb-4 select-none">404</p>
        <h1 className="text-[1.5rem] font-extrabold text-white mb-2">Page not found</h1>
        <p className="text-[0.85rem] text-[#606060] mb-8">This page doesn't exist or was removed.</p>
        <Link href="/home"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-[#0a0a0a] font-bold text-[0.85rem] hover:bg-white/85 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
