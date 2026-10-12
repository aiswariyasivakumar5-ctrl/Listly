"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
exports.categoryRouter = (0, express_1.Router)();
// GET /api/categories
exports.categoryRouter.get('/', async (_req, res) => {
    try {
        const categories = await prisma_js_1.prisma.category.findMany({
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
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Failed to retrieve categories.' });
    }
});
// GET /api/categories/:slug
exports.categoryRouter.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await prisma_js_1.prisma.category.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching category by slug:', error);
        return res.status(500).json({ error: 'Failed to retrieve category details.' });
    }
});
