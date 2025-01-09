const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB bağlantısı
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/events_db';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const eventSchema = new mongoose.Schema({
  eventId: String,
  eventType: String,
  timestamp: String,
  payload: Object,
});

const Event = mongoose.model('Event', eventSchema);

// Express uygulaması
const app = express();
app.use(cors());

app.get('/events', async (req, res) => {
  const { eventType, startDate, endDate, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (eventType) filter.eventType = eventType;
  if (startDate || endDate) filter.timestamp = {};
  if (startDate) filter.timestamp.$gte = new Date(startDate);
  if (endDate) filter.timestamp.$lte = new Date(endDate);

  try {
    const events = await Event.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
