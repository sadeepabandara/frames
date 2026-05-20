import { Navbar } from '@/components/layout/Navbar';
import { MediaModal } from '@/components/media/MediaModal';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { Footer } from '@/components/layout/Footer';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <SearchOverlay />
      <main>{children}</main>
      <Footer />
      <MediaModal />
    </div>
  );
}
