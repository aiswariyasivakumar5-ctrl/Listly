"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
exports.authRouter = (0, express_1.Router)();
// POST /api/auth/register
exports.authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, displayName, phone } = req.body;
        if (!email || !password || !displayName) {
            return res.status(400).json({ error: 'Display name, valid email, and password are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await prisma_js_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email address already exists.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_js_1.prisma.user.create({
            data: {
                email: normalizedEmail,
                displayName: displayName.trim(),
                passwordHash,
                phone: phone?.trim() || null,
            },
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
        const token = (0, auth_js_1.signToken)({ id: user.id, email: user.email });
        return res.status(201).json({ user, token });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
});
// POST /api/auth/login
exports.authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password.' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma_js_1.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ error: 'Your account is suspended. Please contact support.' });
        }
        const token = (0, auth_js_1.signToken)({ id: user.id, email: user.email });
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                status: user.status,
                createdAt: user.createdAt,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'An error occurred during login. Please try again.' });
    }
});
// GET /api/auth/me
exports.authRouter.get('/me', auth_js_1.requireAuth, async (req, res) => {
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
                _count: {
                    select: {
                        listings: true,
                        favorites: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve user profile.' });
    }
});
// POST /api/auth/logout
exports.authRouter.post('/logout', (_req, res) => {
    return res.json({ message: 'Successfully logged out.' });
});
// POST /api/auth/forgot-password
exports.authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Please enter your account email.' });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma_js_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) {
            // Return safe message without revealing if email exists, but include dev token if development
            return res.json({
                message: 'If an account exists with that email, a password reset link has been generated.',
            });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await prisma_js_1.prisma.passwordReset.create({
            data: {
                email: normalizedEmail,
                token: resetToken,
                expiresAt,
            },
        });
        return res.json({
            message: 'Password reset link generated.',
            resetToken, // Provided for direct verification and local development
            expiresAt,
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Failed to process password reset request.' });
    }
});
// POST /api/auth/reset-password
exports.authRouter.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        const resetRecord = await prisma_js_1.prisma.passwordReset.findUnique({
            where: { token },
        });
        if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Reset link is invalid or has expired.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_js_1.prisma.user.update({
            where: { email: resetRecord.email },
            data: { passwordHash },
        });
        await prisma_js_1.prisma.passwordReset.update({
            where: { id: resetRecord.id },
            data: { used: true },
        });
        return res.json({ message: 'Password has been successfully updated. You may now log in.' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: 'Failed to reset password.' });
    }
});
