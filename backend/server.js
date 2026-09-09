// SAHAYAK AI – Citizen Benefits Platform Backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDb } = require('./db/db');
const schemesRouter = require('./routes/schemes');
const eligibilityRouter = require('./routes/eligibility');
const partnersRouter = require('./routes/partners');
const applicationsRouter = require('./routes/applications');
const calculatorRouter = require('./routes/calculator');
const usersRouter = require('./routes/users');
const aiProxyRouter = require('./routes/aiProxy');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Database connection
initDb();

// Routes
app.use('/api/schemes', schemesRouter);
app.use('/api/eligibility', eligibilityRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/calculator', calculatorRouter);
app.use('/api/users', usersRouter);
app.use('/api/ai', aiProxyRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'SAHAYAK AI Citizen Benefits Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 [SAHAYAK AI Backend] Server running on http://localhost:${PORT}`);
    console.log(`📡 Schemes API: http://localhost:${PORT}/api/schemes`);
    console.log(`⚖️ Eligibility Engine API: http://localhost:${PORT}/api/eligibility/check`);
    console.log(`📍 Partners Ranking API: http://localhost:${PORT}/api/partners/rank`);
  });
}

module.exports = app;
