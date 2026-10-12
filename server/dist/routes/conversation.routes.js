"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationRouter = void 0;
const express_1 = require("express");
const prisma_js_1 = require("../lib/prisma.js");
const auth_js_1 = require("../middleware/auth.js");
exports.conversationRouter = (0, express_1.Router)();
// GET /api/conversations - List conversations for authenticated user
exports.conversationRouter.get('/', auth_js_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await prisma_js_1.prisma.conversation.findMany({
            where: {
                OR: [{ starterId: userId }, { recipientId: userId }],
            },
            orderBy: { updatedAt: 'desc' },
            include: {
                listing: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: { take: 1, orderBy: { displayOrder: 'asc' } },
                    },
                },
                starter: {
                    select: { id: true, displayName: true, avatarUrl: true },
                },
                recipient: {
                    select: { id: true, displayName: true, avatarUrl: true },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        const formatted = await Promise.all(conversations.map(async (c) => {
            const otherUser = c.starterId === userId ? c.recipient : c.starter;
            const unreadCount = await prisma_js_1.prisma.message.count({
                where: {
                    conversationId: c.id,
                    senderId: { not: userId },
                    isRead: false,
                },
            });
            return {
                id: c.id,
                listing: c.listing,
                otherUser,
                lastMessage: c.messages[0] || null,
                unreadCount,
                updatedAt: c.updatedAt,
            };
        }));
        return res.json({ conversations: formatted });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ error: 'Failed to retrieve conversations.' });
    }
});
// POST /api/conversations - Start or find conversation
exports.conversationRouter.post('/', auth_js_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { listingId, recipientId, initialMessage } = req.body;
        if (!recipientId) {
            return res.status(400).json({ error: 'Recipient ID is required.' });
        }
        if (recipientId === userId) {
            return res.status(400).json({ error: 'You cannot initiate a conversation with yourself.' });
        }
        // Find existing conversation
        let conversation = await prisma_js_1.prisma.conversation.findFirst({
            where: {
                OR: [
                    { starterId: userId, recipientId, listingId: listingId || null },
                    { starterId: recipientId, recipientId: userId, listingId: listingId || null },
                ],
            },
        });
        if (!conversation) {
            conversation = await prisma_js_1.prisma.conversation.create({
                data: {
                    starterId: userId,
                    recipientId,
                    listingId: listingId || null,
                },
            });
        }
        if (initialMessage && initialMessage.trim().length > 0) {
            await prisma_js_1.prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: userId,
                    content: initialMessage.trim(),
                },
            });
            await prisma_js_1.prisma.conversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date() },
            });
        }
        const fullConversation = await prisma_js_1.prisma.conversation.findUnique({
            where: { id: conversation.id },
            include: {
                listing: {
                    select: { id: true, title: true, price: true, status: true, images: { take: 1 } },
                },
                starter: { select: { id: true, displayName: true, avatarUrl: true } },
                recipient: { select: { id: true, displayName: true, avatarUrl: true } },
            },
        });
        return res.status(201).json({ conversation: fullConversation });
    }
    catch (error) {
        console.error('Error starting conversation:', error);
        return res.status(500).json({ error: 'Failed to start conversation.' });
    }
});
// GET /api/conversations/:id/messages - Get messages in conversation
exports.conversationRouter.get('/:id/messages', auth_js_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const conversation = await prisma_js_1.prisma.conversation.findUnique({
            where: { id },
            include: {
                listing: {
                    select: { id: true, title: true, price: true, status: true, images: { take: 1 } },
                },
                starter: { select: { id: true, displayName: true, avatarUrl: true } },
                recipient: { select: { id: true, displayName: true, avatarUrl: true } },
            },
        });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }
        // Security check: Must be a participant
        if (conversation.starterId !== userId && conversation.recipientId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to access this conversation.' });
        }
        // Mark messages as read for this user
        await prisma_js_1.prisma.message.updateMany({
            where: {
                conversationId: id,
                senderId: { not: userId },
                isRead: false,
            },
            data: { isRead: true },
        });
        const messages = await prisma_js_1.prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: {
                    select: { id: true, displayName: true, avatarUrl: true },
                },
            },
        });
        const otherUser = conversation.starterId === userId ? conversation.recipient : conversation.starter;
        return res.json({
            conversation,
            otherUser,
            messages,
        });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: 'Failed to retrieve messages.' });
    }
});
// POST /api/conversations/:id/messages - Send a message
exports.conversationRouter.post('/:id/messages', auth_js_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Message content cannot be empty.' });
        }
        const conversation = await prisma_js_1.prisma.conversation.findUnique({
            where: { id },
        });
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }
        // Security check
        if (conversation.starterId !== userId && conversation.recipientId !== userId) {
            return res.status(403).json({ error: 'You are not a participant in this conversation.' });
        }
        const message = await prisma_js_1.prisma.message.create({
            data: {
                conversationId: id,
                senderId: userId,
                content: content.trim(),
            },
            include: {
                sender: { select: { id: true, displayName: true, avatarUrl: true } },
            },
        });
        await prisma_js_1.prisma.conversation.update({
            where: { id },
            data: { updatedAt: new Date() },
        });
        return res.status(201).json({ message });
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message.' });
    }
});
// PATCH /api/conversations/:id/read - Mark as read
exports.conversationRouter.patch('/:id/read', auth_js_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await prisma_js_1.prisma.message.updateMany({
            where: {
                conversationId: id,
                senderId: { not: userId },
            },
            data: { isRead: true },
        });
        return res.json({ message: 'Conversation marked as read.' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to mark conversation as read.' });
    }
});
