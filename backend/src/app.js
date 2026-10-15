import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound } from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { uploadsRootPath } from './middleware/upload.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

/* ---------- Security & parsing middleware ---------- */
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  })
);
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

/* ---------- Static uploads ---------- */
app.use('/uploads', express.static(path.join(uploadsRootPath, 'products')));
app.use('/uploads', express.static(uploadsRootPath));

/* ---------- Health check ---------- */
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Essence Aura API is running', uptime: process.uptime() });
});

/* ---------- Rate limiting & API routes ---------- */
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

export default app;