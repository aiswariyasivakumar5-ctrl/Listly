"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
exports.userRouter = (0, express_1.Router)();
// GET /api/users/me - Get current profile
exports.userRouter.get('/me', auth_js_1.requireAuth, async (req, res) => {
    try {
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { id: req.user.id },
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
        if (!user)
            return res.status(404).json({ error: 'User not found.' });
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve profile.' });
    }
});
// PATCH /api/users/me - Update profile
exports.userRouter.patch('/me', auth_js_1.requireAuth, async (req, res) => {
    try {
        const { displayName, phone, bio, avatarUrl } = req.body;
        const updateData = {};
        if (displayName !== undefined && displayName.trim()) {
            updateData.displayName = displayName.trim();
        }
        if (phone !== undefined)
            updateData.phone = phone?.trim() || null;
        if (bio !== undefined)
            updateData.bio = bio?.trim() || null;
        if (avatarUrl !== undefined)
            updateData.avatarUrl = avatarUrl?.trim() || null;
        const user = await prisma_js_1.prisma.user.update({
            where: { id: req.user.id },
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
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Failed to update profile.' });
    }
});
