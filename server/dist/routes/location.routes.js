"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
exports.locationRouter = (0, express_1.Router)();
// GET /api/locations/search
exports.locationRouter.get('/search', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            const locations = await prisma_js_1.prisma.location.findMany({
                orderBy: [{ isPopular: 'desc' }, { city: 'asc' }],
                take: 20,
            });
            return res.json({ locations });
        }
        const locations = await prisma_js_1.prisma.location.findMany({
            where: {
                OR: [
                    { city: { contains: q } },
                    { state: { contains: q } },
                    { metro: { contains: q } },
                    { zipCode: { contains: q } },
                ],
            },
            orderBy: [{ isPopular: 'desc' }, { city: 'asc' }],
            take: 20,
        });
        return res.json({ locations });
    }
    catch (error) {
        console.error('Location search error:', error);
        return res.status(500).json({ error: 'Failed to search locations.' });
    }
});
// GET /api/locations/popular
exports.locationRouter.get('/popular', async (_req, res) => {
    try {
        const locations = await prisma_js_1.prisma.location.findMany({
            where: { isPopular: true },
            orderBy: { city: 'asc' },
        });
        return res.json({ locations });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch popular locations.' });
    }
});
// GET /api/locations/nearby
exports.locationRouter.get('/nearby', async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ error: 'Valid latitude and longitude are required.' });
        }
        const allLocations = await prisma_js_1.prisma.location.findMany();
        // Calculate Euclidean / haversine approximate distance
        const withDistance = allLocations
            .filter((loc) => loc.lat !== null && loc.lng !== null)
            .map((loc) => {
            const dLat = (loc.lat - lat) * 69; // miles approx
            const dLng = (loc.lng - lng) * 54.6;
            const distanceMiles = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
            return { ...loc, distanceMiles };
        })
            .sort((a, b) => a.distanceMiles - b.distanceMiles);
        return res.json({ locations: withDistance.slice(0, 5) });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to find nearby locations.' });
    }
});
