import Link from 'next/link';
import Image from 'next/image';

const LINKS = {
  Browse: [
    { label: 'Movies',       href: '/movies' },
    { label: 'TV Series',    href: '/tv' },
    { label: 'Trending',     href: '/trending' },
    { label: 'New Releases', href: '/movies' },
    { label: 'Top Rated',    href: '/movies' },
  ],
  Genres: [
    { label: 'Action',   href: '/movies' },
    { label: 'Drama',    href: '/tv' },
    { label: 'Sci-Fi',   href: '/movies' },
    { label: 'Comedy',   href: '/movies' },
    { label: 'Horror',   href: '/movies' },
    { label: 'Thriller', href: '/movies' },
  ],
  Account: [
    { label: 'Sign In',        href: '#signin' },
    { label: 'Create Account', href: '#signin' },
    { label: 'My Watchlist',   href: '/watchlist' },
    { label: 'Settings',       href: '/profile' },
    { label: 'Help',           href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.06] pt-14 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/home" aria-label="FRAMES — Home">
              <Image src="/logo.svg" alt="FRAMES" width={34} height={34} />
            </Link>
            <p className="mt-3 text-[0.8rem] text-[#606060] leading-relaxed max-w-[240px]">
              Premium cinematic streaming. Discover films and series across every genre — curated for cinema lovers.
            </p>
          </div>
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col}>
              <h4 className="text-[0.67rem] font-bold tracking-[0.12em] uppercase text-[#606060] mb-4">{col}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[0.8rem] text-white/40 hover:text-[#3b82f6] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-6 border-t border-white/[0.06]">
          <span className="text-[0.72rem] text-[#606060]">
            © 2026 FRAMES · Powered by TMDB · Built for portfolio purposes
          </span>
          <span className="text-[0.78rem] italic text-white/20">Cinema lives here.</span>
        </div>
      </div>
    </footer>
  );
}
