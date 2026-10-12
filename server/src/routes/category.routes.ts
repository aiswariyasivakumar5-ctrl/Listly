import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const categoryRouter = Router();

// GET /api/categories
categoryRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: { listings: { where: { status: 'ACTIVE' } } },
            },
          },
        },
        _count: {
          select: { listings: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    return res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// GET /api/categories/:slug
categoryRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { displayOrder: 'asc' },
          include: {
            _count: {
              select: { listings: { where: { status: 'ACTIVE' } } },
            },
          },
        },
        _count: {
          select: { listings: { where: { status: 'ACTIVE' } } },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    return res.json({ category });
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return res.status(500).json({ error: 'Failed to retrieve category details.' });
  }
});
