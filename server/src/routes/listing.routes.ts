import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.js';

export const listingRouter = Router();

// GET /api/listings - Search, filter, sort, paginate
listingRouter.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const q = ((req.query.q as string) || '').trim();
    const categorySlug = (req.query.category as string) || '';
    const location = ((req.query.location as string) || '').trim();
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const condition = (req.query.condition as string) || '';
    const isFree = req.query.isFree === 'true';
    const status = (req.query.status as string) || 'ACTIVE';
    const sort = (req.query.sort as string) || 'newest';
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt((req.query.limit as string) || '12', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status !== 'ALL') {
      where.status = status;
    }

    if (q) {
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { locationName: { contains: q } },
      ];
    }

    if (categorySlug && categorySlug !== 'all') {
      // Find category and its children
      const cat = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: { children: true },
      });

      if (cat) {
        if (cat.children && cat.children.length > 0) {
          const categoryIds = [cat.id, ...cat.children.map((c) => c.id)];
          where.categoryId = { in: categoryIds };
        } else {
          where.categoryId = cat.id;
        }
      }
    }

    if (location && location !== 'all') {
      where.locationName = { contains: location };
    }

    if (isFree) {
      where.isFree = true;
    } else {
      if (minPrice !== undefined && !isNaN(minPrice)) {
        where.price = { ...(where.price || {}), gte: minPrice };
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        where.price = { ...(where.price || {}), lte: maxPrice };
      }
    }

    if (condition && condition !== 'all') {
      where.condition = condition;
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'views') {
      orderBy = { views: 'desc' };
    }

    const [total, listings] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, parent: true },
          },
          owner: {
            select: { id: true, displayName: true, avatarUrl: true },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 3,
          },
          _count: {
            select: { favorites: true },
          },
        },
      }),
    ]);

    // Check if current user favorited
    let favoritedIds = new Set<string>();
    if (req.user?.id) {
      const userFavs = await prisma.favorite.findMany({
        where: {
          userId: req.user.id,
          listingId: { in: listings.map((l) => l.id) },
        },
        select: { listingId: true },
      });
      favoritedIds = new Set(userFavs.map((f) => f.listingId));
    }

    const mappedListings = listings.map((l) => ({
      ...l,
      isFavorited: favoritedIds.has(l.id),
      favoriteCount: l._count.favorites,
    }));

    return res.json({
      listings: mappedListings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error querying listings:', error);
    return res.status(500).json({ error: 'Failed to retrieve listings.' });
  }
});

// GET /api/listings/:id - Detail view
listingRouter.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: {
          include: { parent: true },
        },
        owner: {
          select: {
            id: true,
            displayName: true,
            email: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            _count: {
              select: { listings: { where: { status: 'ACTIVE' } } },
            },
          },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { favorites: true },
        },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    // Increment views asynchronously
    prisma.listing
      .update({
        where: { id },
        data: { views: { increment: 1 } },
      })
      .catch((e) => console.error('Error incrementing view count:', e));

    let isFavorited = false;
    if (req.user?.id) {
      const fav = await prisma.favorite.findUnique({
        where: {
          userId_listingId: {
            userId: req.user.id,
            listingId: id,
          },
        },
      });
      isFavorited = !!fav;
    }

    return res.json({
      listing: {
        ...listing,
        isFavorited,
        favoriteCount: listing._count.favorites,
      },
    });
  } catch (error) {
    console.error('Error retrieving listing details:', error);
    return res.status(500).json({ error: 'Failed to fetch listing details.' });
  }
});

// POST /api/listings - Create listing (protected)
listingRouter.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      categoryId,
      price,
      isNegotiable,
      isFree,
      locationName,
      zipCode,
      condition,
      attributes,
      images,
    } = req.body;

    if (!title || title.trim().length < 5) {
      return res.status(400).json({ error: 'Listing title must be at least 5 characters long.' });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ error: 'Listing description must be at least 10 characters long.' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Please select a valid category.' });
    }

    if (!locationName) {
      return res.status(400).json({ error: 'Please enter a valid location (e.g. City, State).' });
    }

    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return res.status(400).json({ error: 'Selected category does not exist.' });
    }

    const numericPrice = isFree ? 0 : price !== undefined && price !== null && price !== '' ? parseFloat(price) : null;

    const listing = await prisma.listing.create({
      data: {
        ownerId: req.user!.id,
        categoryId,
        title: title.trim(),
        description: description.trim(),
        price: numericPrice,
        isNegotiable: Boolean(isNegotiable),
        isFree: Boolean(isFree),
        locationName: locationName.trim(),
        zipCode: zipCode?.trim() || null,
        condition: condition || null,
        attributes: typeof attributes === 'object' ? JSON.stringify(attributes) : attributes || null,
        currency: 'INR',
        status: 'ACTIVE',
      },
    });

    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        if (images[i] && typeof images[i] === 'string') {
          await prisma.listingImage.create({
            data: {
              listingId: listing.id,
              url: images[i],
              displayOrder: i,
            },
          });
        }
      }
    }

    const createdListing = await prisma.listing.findUnique({
      where: { id: listing.id },
      include: {
        category: true,
        images: true,
        owner: { select: { id: true, displayName: true, email: true } },
      },
    });

    return res.status(201).json({ listing: createdListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    return res.status(500).json({ error: 'Failed to create listing. Please try again.' });
  }
});

// PATCH /api/listings/:id - Update listing (protected, owner only)
listingRouter.patch('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.listing.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    if (existing.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'You are not authorized to modify this listing.' });
    }

    const {
      title,
      description,
      categoryId,
      price,
      isNegotiable,
      isFree,
      locationName,
      zipCode,
      status,
      condition,
      attributes,
      images,
    } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (price !== undefined) updateData.price = price === null || price === '' ? null : parseFloat(price);
    if (isNegotiable !== undefined) updateData.isNegotiable = Boolean(isNegotiable);
    if (isFree !== undefined) {
      updateData.isFree = Boolean(isFree);
      if (updateData.isFree) updateData.price = 0;
    }
    if (locationName !== undefined) updateData.locationName = locationName.trim();
    if (zipCode !== undefined) updateData.zipCode = zipCode?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (condition !== undefined) updateData.condition = condition;
    if (attributes !== undefined) {
      updateData.attributes = typeof attributes === 'object' ? JSON.stringify(attributes) : attributes;
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: updateData,
    });

    if (Array.isArray(images)) {
      await prisma.listingImage.deleteMany({ where: { listingId: id } });
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          await prisma.listingImage.create({
            data: {
              listingId: id,
              url: images[i],
              displayOrder: i,
            },
          });
        }
      }
    }

    const fullListing = await prisma.listing.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    return res.json({ listing: fullListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    return res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// DELETE /api/listings/:id - Delete listing (protected, owner only)
listingRouter.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.listing.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    if (existing.ownerId !== req.user!.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this listing.' });
    }

    await prisma.listing.delete({ where: { id } });
    return res.json({ message: 'Listing has been deleted successfully.' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

// GET /api/users/me/listings - Listings created by authenticated user
listingRouter.get('/user/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { ownerId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: { take: 1, orderBy: { displayOrder: 'asc' } },
        _count: {
          select: { favorites: true, reports: true },
        },
      },
    });

    return res.json({ listings });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});
