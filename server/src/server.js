import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import caseRoutes from './routes/caseRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Permissive CORS for deployed Vercel and local dev
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Mystery Room API',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key'),
  });
});

// Case routes
app.use('/api/cases', caseRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI Mystery Room API',
    status: 'online',
    endpoints: {
      health: '/api/health',
      createCase: 'POST /api/cases',
      getCase: 'GET /api/cases/:id',
      discoverClue: 'POST /api/cases/:id/clues/:clueId/discover',
      requestHint: 'POST /api/cases/:id/hints',
      submitAccuse: 'POST /api/cases/:id/accuse',
      getResult: 'GET /api/cases/:id/result',
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GlobalErrorHandler]', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to DB and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`🕵️ AI Mystery Room API running on port ${PORT}`);
      console.log(`📡 Health Check: /api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
