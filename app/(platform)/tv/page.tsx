'use client';
import { useQuery } from '@tanstack/react-query';
import { getTopRatedTV, getPopularTV, getTVByGenre, getTVByNetwork, GENRE_IDS, NETWORK_IDS } from '@/services/tmdb/client';
import { MediaRow } from '@/components/media/MediaRow';

export default function TVPage() {
  return (
    <div className="pt-[58px] bg-[#0a0a0a] min-h-screen">
      <div className="px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white">TV Series</h1>
        <p className="text-[0.85rem] text-[#606060] mt-1">Binge-worthy series from around the world.</p>
      </div>
      <TVContent />
    </div>
  );
}

function TVContent() {
  const { data: popular, isLoading: popularLoading } = useQuery({ queryKey: ['tv-popular'], queryFn: () => getPopularTV() });
  const { data: topRated, isLoading: topLoading } = useQuery({ queryKey: ['tv-toprated'], queryFn: () => getTopRatedTV() });
  const { data: netflix } = useQuery({ queryKey: ['tv-netflix'], queryFn: () => getTVByNetwork(NETWORK_IDS.NETFLIX) });
  const { data: hbo } = useQuery({ queryKey: ['tv-hbo'], queryFn: () => getTVByNetwork(NETWORK_IDS.HBO) });
  const { data: drama } = useQuery({ queryKey: ['tv-drama'], queryFn: () => getTVByGenre(GENRE_IDS.DRAMA) });
  const { data: scifi } = useQuery({ queryKey: ['tv-scifi'], queryFn: () => getTVByGenre(GENRE_IDS.SCIFI) });
  const { data: crime } = useQuery({ queryKey: ['tv-crime'], queryFn: () => getTVByGenre(GENRE_IDS.CRIME) });
  const { data: comedy } = useQuery({ queryKey: ['tv-comedy'], queryFn: () => getTVByGenre(GENRE_IDS.COMEDY) });

  return (
    <div className="space-y-8 pb-16">
      <MediaRow title="Popular Series" items={popular?.results} isLoading={popularLoading} mediaType="tv" variant="wide" viewAllHref="/browse?c=tv-popular" />
      <MediaRow title="Top Rated Series" items={topRated?.results} isLoading={topLoading} mediaType="tv" variant="backdrop" viewAllHref="/browse?c=tv-toprated" />
      <MediaRow title="Netflix Originals" items={netflix?.results} mediaType="tv" variant="poster" viewAllHref="/browse?c=tv-netflix" />
      <MediaRow title="HBO Series" items={hbo?.results} mediaType="tv" variant="wide" />
      <MediaRow title="Drama" items={drama?.results} mediaType="tv" variant="backdrop" viewAllHref="/browse?c=tv-drama" />
      <MediaRow title="Sci-Fi Series" items={scifi?.results} mediaType="tv" variant="backdrop" viewAllHref="/browse?c=tv-scifi" />
      <MediaRow title="Crime & Mystery" items={crime?.results} mediaType="tv" variant="backdrop" viewAllHref="/browse?c=tv-crime" />
      <MediaRow title="Comedy Series" items={comedy?.results} mediaType="tv" variant="backdrop" viewAllHref="/browse?c=tv-comedy" />
    </div>
  );
}
