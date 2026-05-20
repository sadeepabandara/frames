import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Tv, Play } from 'lucide-react';
import { MyListButton } from '@/components/media/MyListButton';
import { getTVDetail, tmdbImage } from '@/services/tmdb/client';
import { EpisodesSectionClient } from './EpisodesSectionClient';
import { getMediaTitle, getYear, formatScore, formatVoteCount } from '@/lib/utils';
import { TVDetailClient } from './TVDetailClient';
import { TVPlayButton } from './TVPlayButton';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const show = await getTVDetail(Number(id));
    return { title: show.name, description: show.overview?.slice(0, 160) };
  } catch { return { title: 'TV Series' }; }
}

export default async function TVDetailPage({ params }: Props) {
  const { id } = await params;
  let show: any;
  try { show = await getTVDetail(Number(id)); }
  catch { notFound(); }

  const trailer = show.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    || show.videos?.results?.find((v: any) => v.site === 'YouTube');
  const trailerKey = trailer?.key || null;
  const cast = show.credits?.cast?.slice(0, 12) || [];
  const recommendations = show.recommendations?.results?.filter((m: any) => m.poster_path).slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <TVDetailClient
        id={show.id}
        type="tv"
        title={show.name}
        backdropPath={show.backdrop_path}
        trailerKey={trailerKey}
        seasons={show.number_of_seasons}
      />

      <div className="px-6 lg:px-12 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10 -mt-40 relative z-30">
          <div className="hidden md:block flex-shrink-0 w-48 rounded-xl overflow-hidden shadow-2xl relative z-10 border border-white/[0.06]">
            <Image src={tmdbImage(show.poster_path, 'w342')} alt={show.name}
              width={192} height={288} className="w-full" style={{ height: 'auto' }} unoptimized />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              {show.genres?.map((g: any) => (
                <span key={g.id} className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold uppercase tracking-wider bg-white/[0.06] text-[#a0a0a0] border border-white/[0.08]">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-[2rem] lg:text-[2.8rem] font-extrabold tracking-tight text-white leading-tight mb-2">
              {show.name}
            </h1>
            {show.tagline && <p className="text-[0.88rem] text-[#3b82f6] italic mb-4">{show.tagline}</p>}
            <div className="flex items-center flex-wrap gap-3 text-[0.82rem] text-[#a0a0a0] mb-5">
              <span className="flex items-center gap-1 text-[#3b82f6] font-bold">
                <Star size={13} className="fill-[#3b82f6]" />{formatScore(show.vote_average)}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#444]" />
              <span>{getYear(show.first_air_date)}</span>
              {show.number_of_seasons && <>
                <span className="w-1 h-1 rounded-full bg-[#444]" />
                <span className="flex items-center gap-1"><Tv size={12} />{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
              </>}
              <span className="w-1 h-1 rounded-full bg-[#444]" />
              <span>{formatVoteCount(show.vote_count)} votes</span>
            </div>
            <p className="text-[0.9rem] text-white/65 leading-relaxed mb-6 max-w-2xl">{show.overview}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <TVPlayButton tmdbId={show.id} title={show.name} />
              <MyListButton
                item={{ id: show.id, type: 'tv', title: show.name, poster_path: show.poster_path, vote_average: show.vote_average }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.08] text-white font-semibold text-[0.88rem] border border-white/[0.12] hover:bg-white/[0.14] transition-all hover:-translate-y-0.5"
              />
            </div>
          </div>
        </div>

        {show.seasons && show.seasons.length > 0 && (
          <EpisodesSection show={show} />
        )}

        {cast.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[1rem] font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#3b82f6] rounded-full inline-block" />Actors
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {cast.map((member: any) => (
                <div key={member.id} className="text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#1e1e1e] mx-auto mb-2 border border-white/[0.06]">
                    {member.profile_path
                      ? <Image src={tmdbImage(member.profile_path, 'w185')} alt={member.name}
                          width={64} height={64} className="w-full h-full object-cover" style={{ width: '100%', height: '100%' }} unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-[#606060] font-bold">{member.name[0]}</div>
                    }
                  </div>
                  <p className="text-[0.7rem] font-semibold text-white/80 leading-tight">{member.name}</p>
                  <p className="text-[0.62rem] text-[#606060] leading-tight mt-0.5 line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-[1rem] font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#3b82f6] rounded-full inline-block" />You May Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recommendations.map((m: any) => (
                <Link key={m.id} href={`/tv/${m.id}`}
                  className="group block rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/[0.04] hover:border-white/[0.12] transition-all hover:-translate-y-1">
                  <div className="relative" style={{ paddingBottom: '150%' }}>
                    <Image src={tmdbImage(m.poster_path, 'w342')} alt={getMediaTitle(m)}
                      fill sizes="200px" className="object-cover" unoptimized />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[0.72rem] font-semibold text-white/80 line-clamp-1">{getMediaTitle(m)}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={9} className="fill-[#3b82f6] text-[#3b82f6]" />
                      <span className="text-[0.62rem] text-[#a0a0a0]">{formatScore(m.vote_average)}</span>
                      <span className="text-[0.62rem] text-[#606060] ml-1">{getYear(m.first_air_date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EpisodesSection({ show }: { show: any }) {
  return <EpisodesSectionClient show={show} />;
}
