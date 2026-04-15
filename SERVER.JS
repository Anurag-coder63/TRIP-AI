const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Only these 3 routes needed now
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/ai',    require('./routes/ai'));
app.use('/api/user',  require('./routes/user'));

app.get('/', (req, res) => {
  res.json({ status: 'TripAI server running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
