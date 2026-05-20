'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Home, Film, Tv, Bookmark } from 'lucide-react';
import { useScrollPosition } from '@/hooks';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
const NAV_LINKS = [
  { href: '/home',      label: 'Home',    icon: Home },
  { href: '/movies',    label: 'Movies',  icon: Film },
  { href: '/tv',        label: 'Series',  icon: Tv },
  { href: '/watchlist', label: 'My List', icon: Bookmark },
];

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrollPosition(60);
  const { setSearchOpen, videoPlayerOpen } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Hide navbar when video player is open
  if (videoPlayerOpen) return null;

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 h-[58px] flex items-center transition-all duration-300',
        scrolled
          ? 'bg-[rgba(10,10,10,0.96)] backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      )}>
        <div className="w-full flex items-center gap-8 px-6 lg:px-8">

          <Link href="/home" className="flex-shrink-0 select-none" aria-label="FRAMES — Home">
            <Image src="/logo.svg" alt="FRAMES" width={34} height={34} priority />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/home' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.82rem] font-medium transition-colors',
                    active
                      ? 'text-[#3b82f6] bg-[rgba(59,130,246,0.08)]'
                      : 'text-white/80 hover:text-white hover:bg-white/[0.05]'
                  )}>
                  <Icon size={14} strokeWidth={active ? 2.5 : 2} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          <div className="flex items-center gap-1.5">
            <button onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Search">
              <Search size={16} />
            </button>

            {isSignedIn ? (
              /* Clerk's UserButton — shows avatar, handles sign out, profile, etc. */
              <div className="ml-1">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8 rounded-full border border-white/20',
                      userButtonPopoverCard: 'bg-[#1a1a1a] border border-white/[0.08]',
                      userButtonPopoverActionButton: 'text-white hover:bg-white/[0.06]',
                      userButtonPopoverActionButtonText: 'text-white',
                      userButtonPopoverFooter: 'hidden',
                    },
                  }}
                />
              </div>
            ) : (
              /* Not signed in — show Sign In button using Clerk's modal */
              <SignInButton mode="modal">
                <button
                  className="ml-1 w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.14] transition-colors"
                  aria-label="Sign in">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
              </SignInButton>
            )}

            <button onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors ml-1"
              aria-label="Toggle menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.9)] backdrop-blur-xl pt-[58px] flex flex-col">
          <nav className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-[0.95rem] font-medium transition-colors',
                  pathname === link.href ? 'text-white bg-white/[0.1]' : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                )}>
                {link.label}
              </Link>
            ))}
            {isSignedIn ? null : (
              <SignInButton mode="modal">
                <button className="mt-2 px-4 py-3 rounded-lg text-[0.95rem] font-medium text-[#3b82f6] hover:bg-white/[0.06] text-left transition-colors w-full">
                  Sign In / Sign Up
                </button>
              </SignInButton>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
