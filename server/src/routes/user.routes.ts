import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const userRouter = Router();

// GET /api/users/me - Get current profile
userRouter.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// PATCH /api/users/me - Update profile
userRouter.patch('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { displayName, phone, bio, avatarUrl } = req.body;

    const updateData: any = {};
    if (displayName !== undefined && displayName.trim()) {
      updateData.displayName = displayName.trim();
    }
    if (phone !== undefined) updateData.phone = phone?.trim() || null;
    if (bio !== undefined) updateData.bio = bio?.trim() || null;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl?.trim() || null;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json({ user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});
