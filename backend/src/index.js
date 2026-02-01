/**
 * Backend entrypoint — AI Router + Auth + Subscription (MVP)
 *
 * Notes:
 * - Storage for user accounts and sessions are purposely minimal for MVP.
 * - Replace localStorage-based persistence with a real DB in production.
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/ai', aiRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});