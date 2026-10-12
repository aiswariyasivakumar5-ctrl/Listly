import { Router, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

export const reportRouter = Router();

// POST /api/reports - Report a listing
reportRouter.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { listingId, reason, details } = req.body;

    if (!listingId || !reason) {
      return res.status(400).json({ error: 'Listing ID and report reason are required.' });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const report = await prisma.report.create({
      data: {
        listingId,
        reporterId: req.user?.id || null,
        reason: reason.trim(),
        details: details?.trim() || null,
        status: 'PENDING',
      },
    });

    return res.status(201).json({
      message: 'Thank you for helping keep the marketplace safe. Your report has been submitted to moderation.',
      reportId: report.id,
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ error: 'Failed to submit report. Please try again.' });
  }
});
