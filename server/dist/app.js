"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_routes_js_1 = require("./routes/auth.routes.js");
const category_routes_js_1 = require("./routes/category.routes.js");
const location_routes_js_1 = require("./routes/location.routes.js");
const listing_routes_js_1 = require("./routes/listing.routes.js");
const favorite_routes_js_1 = require("./routes/favorite.routes.js");
const conversation_routes_js_1 = require("./routes/conversation.routes.js");
const report_routes_js_1 = require("./routes/report.routes.js");
const upload_routes_js_1 = require("./routes/upload.routes.js");
const user_routes_js_1 = require("./routes/user.routes.js");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl) or localhost origins
        if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '10mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Serve uploaded media
const uploadsPath = path_1.default.resolve(process.cwd(), 'uploads');
exports.app.use('/uploads', express_1.default.static(uploadsPath));
// API health check
exports.app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});
// Mount Routes
exports.app.use('/api/auth', auth_routes_js_1.authRouter);
exports.app.use('/api/categories', category_routes_js_1.categoryRouter);
exports.app.use('/api/locations', location_routes_js_1.locationRouter);
exports.app.use('/api/listings', listing_routes_js_1.listingRouter);
exports.app.use('/api/favorites', favorite_routes_js_1.favoriteRouter);
exports.app.use('/api/conversations', conversation_routes_js_1.conversationRouter);
exports.app.use('/api/reports', report_routes_js_1.reportRouter);
exports.app.use('/api/upload', upload_routes_js_1.uploadRouter);
exports.app.use('/api/users', user_routes_js_1.userRouter);
// Serve frontend static build in production
const clientDistPath = path_1.default.resolve(process.cwd(), '../client/dist');
exports.app.use(express_1.default.static(clientDistPath));
exports.app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
    }
    res.sendFile(path_1.default.join(clientDistPath, 'index.html'), (err) => {
        if (err)
            next();
    });
});
// Global Error Handler
exports.app.use((err, _req, res, _next) => {
    console.error('Unhandled server error:', err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'An unexpected server error occurred.',
    });
});
