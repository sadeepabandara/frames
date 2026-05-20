'use client';
import { useUser } from '@clerk/nextjs';
import { UserProfile } from '@clerk/nextjs';
import { useWatchlist } from '@/hooks';
import { Film, Tv, List } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useUser();
  const { items } = useWatchlist();

  const movieCount = items.filter(i => i.type === 'movie').length;
  const tvCount    = items.filter(i => i.type === 'tv').length;

  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen px-4 lg:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[1.8rem] font-extrabold text-white mb-8">Profile</h1>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Total Saved', value: items.length, icon: List },
            { label: 'Movies',      value: movieCount,   icon: Film },
            { label: 'TV Series',   value: tvCount,      icon: Tv   },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#141414] rounded-xl border border-white/[0.06] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#3b82f6]" />
              </div>
              <div>
                <p className="text-[1.3rem] font-extrabold text-white leading-none">{value}</p>
                <p className="text-[0.72rem] text-[#606060] mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clerk's UserProfile component - handles name, email, password, 2FA, etc. */}
        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#141414] border border-white/[0.06] shadow-none rounded-xl w-full',
              navbar: 'bg-[#111] border-r border-white/[0.06]',
              navbarButton: 'text-white/60 hover:text-white hover:bg-white/[0.06]',
              navbarButtonActive: 'text-[#3b82f6] bg-[rgba(59,130,246,0.08)]',
              pageScrollBox: 'bg-[#141414]',
              formButtonPrimary: 'bg-[#3b82f6] hover:bg-[#2563eb] text-black font-bold',
              formFieldInput: 'bg-white/[0.06] border-white/[0.08] text-white',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/40',
            },
          }}
        />
      </div>
    </div>
  );
}
