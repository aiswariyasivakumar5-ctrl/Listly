"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
exports.reportRouter = (0, express_1.Router)();
// POST /api/reports - Report a listing
exports.reportRouter.post('/', auth_js_1.optionalAuth, async (req, res) => {
    try {
        const { listingId, reason, details } = req.body;
        if (!listingId || !reason) {
            return res.status(400).json({ error: 'Listing ID and report reason are required.' });
        }
        const listing = await prisma_js_1.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found.' });
        }
        const report = await prisma_js_1.prisma.report.create({
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
    }
    catch (error) {
        console.error('Error submitting report:', error);
        return res.status(500).json({ error: 'Failed to submit report. Please try again.' });
    }
});
