const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Allow the frontend origin
  if (origin === 'http://localhost:5173') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24h

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Classroom Automation API is running 🚀' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed default devices on first run
    const Device = require('./models/Device');
    const count = await Device.countDocuments();
    if (count === 0) {
      await Device.insertMany([
        { name: 'Light 1', type: 'light', isOn: false, powerConsumption: 20 },
        { name: 'Light 2', type: 'light', isOn: false, powerConsumption: 22 },
        { name: 'Light 3', type: 'light', isOn: false, powerConsumption: 18 },
        { name: 'Fan 1',   type: 'fan',   isOn: false, powerConsumption: 40 },
        { name: 'Fan 2',   type: 'fan',   isOn: false, powerConsumption: 45 },
        { name: 'Fan 3',   type: 'fan',   isOn: false, powerConsumption: 38 },
      ]);
      console.log('🌱 Default devices seeded');
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
