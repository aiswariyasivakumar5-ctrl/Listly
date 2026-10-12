"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
exports.favoriteRouter = (0, express_1.Router)();
// GET /api/favorites - Get all saved listings
exports.favoriteRouter.get('/', auth_js_1.requireAuth, async (req, res) => {
    try {
        const favorites = await prisma_js_1.prisma.favorite.findMany({
            where: { userId: req.user.id },
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
    }
    catch (error) {
        console.error('Error fetching favorites:', error);
        return res.status(500).json({ error: 'Failed to retrieve saved listings.' });
    }
});
// POST /api/favorites/:listingId - Save a listing
exports.favoriteRouter.post('/:listingId', auth_js_1.requireAuth, async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await prisma_js_1.prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found.' });
        }
        const existing = await prisma_js_1.prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId: req.user.id,
                    listingId,
                },
            },
        });
        if (existing) {
            return res.json({ message: 'Listing is already in your saved items.', favorite: existing });
        }
        const favorite = await prisma_js_1.prisma.favorite.create({
            data: {
                userId: req.user.id,
                listingId,
            },
        });
        return res.status(201).json({ message: 'Listing saved to favorites.', favorite });
    }
    catch (error) {
        console.error('Error saving favorite:', error);
        return res.status(500).json({ error: 'Failed to save listing.' });
    }
});
// DELETE /api/favorites/:listingId - Remove from favorites
exports.favoriteRouter.delete('/:listingId', auth_js_1.requireAuth, async (req, res) => {
    try {
        const { listingId } = req.params;
        await prisma_js_1.prisma.favorite.deleteMany({
            where: {
                userId: req.user.id,
                listingId,
            },
        });
        return res.json({ message: 'Listing removed from favorites.' });
    }
    catch (error) {
        console.error('Error deleting favorite:', error);
        return res.status(500).json({ error: 'Failed to remove listing from favorites.' });
    }
});
