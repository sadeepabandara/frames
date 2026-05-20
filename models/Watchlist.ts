import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWatchlistItem {
  id: number;          // TMDB id
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: string;
}

export interface IWatchlist extends Document {
  userId: string;      // Clerk userId
  items: IWatchlistItem[];
}

const WatchlistItemSchema = new Schema<IWatchlistItem>(
  {
    id:           { type: Number, required: true },
    type:         { type: String, enum: ['movie', 'tv'], required: true },
    title:        { type: String, required: true },
    poster_path:  { type: String, default: null },
    vote_average: { type: Number, default: 0 },
    addedAt:      { type: String, required: true },
  },
  { _id: false }
);

const WatchlistSchema = new Schema<IWatchlist>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items:  { type: [WatchlistItemSchema], default: [] },
  },
  { timestamps: true }
);

// Avoid model re-registration during hot-reload
export const Watchlist: Model<IWatchlist> =
  mongoose.models.Watchlist ||
  mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
