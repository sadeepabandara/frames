import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Watchlist } from '@/models/Watchlist';

// GET /api/watchlist — fetch the signed-in user's list
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const doc = await Watchlist.findOne({ userId });
  return NextResponse.json({ items: doc?.items ?? [] });
}

// POST /api/watchlist — add an item
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, type, title, poster_path, vote_average } = body;

  if (!id || !type || !title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  const newItem = {
    id,
    type,
    title,
    poster_path: poster_path ?? null,
    vote_average: vote_average ?? 0,
    addedAt: new Date().toISOString(),
  };

  await Watchlist.findOneAndUpdate(
    { userId },
    // Push to front, but only if this id isn't already in the list
    { $push: { items: { $each: [newItem], $position: 0 } } },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, item: newItem });
}

// DELETE /api/watchlist — remove an item by TMDB id
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await connectDB();

  await Watchlist.findOneAndUpdate(
    { userId },
    { $pull: { items: { id } } }
  );

  return NextResponse.json({ success: true });
}
