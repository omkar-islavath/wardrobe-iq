import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB, { isDbConnected } from './config/db.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import wardrobeRoutes from './routes/wardrobeRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import selfieRoutes from './routes/selfieRoutes.js';
import shoppingRoutes from './routes/shoppingRoutes.js';

// Connect to database
connectDB();

const app = express();

// Enable trust proxy to retrieve client IP from X-Forwarded-For headers
app.set('trust proxy', true);

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists in working directory
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static folder for local file upload fallback
app.use('/uploads', express.static(uploadsDir));

// Database connection status check middleware
app.use('/api', (req, res, next) => {
  if (!isDbConnected) {
    return res.status(503).json({
      success: false,
      error: 'Database is not connected. Please start your PostgreSQL service (port 5432) and ensure the database "wardrobe_iq" is created, or verify the credentials in your backend .env file.'
    });
  }
  next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/selfie', selfieRoutes);
app.use('/api/shopping', shoppingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Root API welcome
app.get('/', (req, res) => {
  res.send('Welcome to the WardrobeIQ API');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Resource not found' });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
