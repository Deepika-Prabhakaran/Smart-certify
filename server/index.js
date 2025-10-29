import './telemetry.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB, initializeTables } from './db.js';
import requestsRoutes from './routes/requests.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

// ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (PDF certificates)
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// API Routes
app.use('/api', requestsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Smart Certify Backend',
    version: '1.0.0'
  });
});

// ✅ Telemetry test endpoint (paste this block below health check)
app.get('/api/test-telemetry', async (req, res) => {
  console.log('Telemetry test route called');

  try {
    // Dynamically import Application Insights SDK and use the default client
    const appInsights = (await import('applicationinsights')).default;
    const client = appInsights.defaultClient;

    client.trackEvent({ name: 'TelemetryTestEvent', properties: { user: 'Deepika', feature: 'AI Monitoring' } });
    client.trackTrace({ message: 'Telemetry route hit successfully!' });
    client.trackMetric({ name: 'TestMetric', value: 42 });

    // Attempt to flush immediately (best-effort)
    try {
      client.flush();
    } catch (flushErr) {
      console.warn('Telemetry flush warning:', flushErr);
    }

    res.json({
      message: 'Telemetry event sent successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Telemetry test failed:', err);
    res.status(500).json({ error: 'Failed to send telemetry', details: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Initialize database tables for authentication
    await initializeTables();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Frontend should connect to: http://localhost:${PORT}/api/...`);
      console.log(`Authentication routes available at: http://localhost:${PORT}/api/auth/...`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
