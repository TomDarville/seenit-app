// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to Database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/seenit')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// 2. Database Schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  bio: String,
  connectedServices: {
    netflix: { type: Boolean, default: false },
    disney: { type: Boolean, default: false },
    prime: { type: Boolean, default: false }
  }
});

const HistorySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  service: String, // 'netflix', 'disney', 'prime'
  watchedAt: { type: Date, default: Date.now },
  userRating: { type: Number, default: 0 } // 1-5 Stars
});

const User = mongoose.model('User', UserSchema);
const History = mongoose.model('History', HistorySchema);

// 3. API Endpoints
// Fetch Profile
app.get('/api/profile/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update Profile Bio
app.put('/api/profile/:id', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, { bio: req.body.bio }, { new: true });
  res.json(updatedUser);
});

// Fetch Unified Watch History
app.get('/api/history/:userId', async (req, res) => {
  const history = await History.find({ userId: req.params.userId }).sort({ watchedAt: -1 });
  res.json(history);
});

// Rate an item
app.post('/api/rate', async (req, res) => {
  const { historyId, rating } = req.body;
  const updatedItem = await History.findByIdAndUpdate(historyId, { userRating: rating }, { new: true });
  res.json(updatedItem);
});

// Simulated Sync Route (Where web scrapers/SDKs drop data)
app.post('/api/sync/:userId', async (req, res) => {
  const { userId } = req.params;
  const { service, items } = req.body; // Array of titles watched

  const mockHistoryPayload = items.map(title => ({
    userId,
    title,
    service,
    watchedAt: new Date()
  }));

  await History.insertMany(mockHistoryPayload);
  await User.findByIdAndUpdate(userId, { [`connectedServices.${service}`]: true });
  
  res.json({ message: `Successfully synced ${items.length} items from ${service}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
