import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { locationRouter } from './routes/location.routes.js';
import { listingRouter } from './routes/listing.routes.js';
import { favoriteRouter } from './routes/favorite.routes.js';
import { conversationRouter } from './routes/conversation.routes.js';
import { reportRouter } from './routes/report.routes.js';
import { uploadRouter } from './routes/upload.routes.js';
import { userRouter } from './routes/user.routes.js';

export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or localhost origins
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded media
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/locations', locationRouter);
app.use('/api/listings', listingRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/reports', reportRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/users', userRouter);

// Serve frontend static build in production
const clientDistPath = path.resolve(process.cwd(), '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected server error occurred.',
  });
});
