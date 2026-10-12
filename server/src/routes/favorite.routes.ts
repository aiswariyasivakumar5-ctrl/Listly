import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const favoriteRouter = Router();

// GET /api/favorites - Get all saved listings
favoriteRouter.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: {
          include: {
            category: true,
            owner: { select: { id: true, displayName: true, avatarUrl: true } },
            images: { take: 1, orderBy: { displayOrder: 'asc' } },
            _count: { select: { favorites: true } },
          },
        },
      },
    });

    const listings = favorites
      .filter((f) => f.listing !== null)
      .map((f) => ({
        ...f.listing,
        isFavorited: true,
        favoriteCount: f.listing._count.favorites,
        savedAt: f.createdAt,
      }));

    return res.json({ listings });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ error: 'Failed to retrieve saved listings.' });
  }
});

// POST /api/favorites/:listingId - Save a listing
favoriteRouter.post('/:listingId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: req.user!.id,
          listingId,
        },
      },
    });

    if (existing) {
      return res.json({ message: 'Listing is already in your saved items.', favorite: existing });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user!.id,
        listingId,
      },
    });

    return res.status(201).json({ message: 'Listing saved to favorites.', favorite });
  } catch (error) {
    console.error('Error saving favorite:', error);
    return res.status(500).json({ error: 'Failed to save listing.' });
  }
});

// DELETE /api/favorites/:listingId - Remove from favorites
favoriteRouter.delete('/:listingId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { listingId } = req.params;

    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.id,
        listingId,
      },
    });

    return res.json({ message: 'Listing removed from favorites.' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return res.status(500).json({ error: 'Failed to remove listing from favorites.' });
  }
});
