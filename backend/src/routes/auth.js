/**
 * Simple auth endpoints for signup/login.
 * Passwords hashed with bcrypt for demo, but data is persisted client-side (localStorage).
 *
 * In the MVP we accept email/password and return a user object:
 * {
 *   id, email, hashedPassword
 * }
 *
 * The client persists to localStorage (Not secure for production).
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Temporary in-memory store for demonstration (resets on server restart)
const transientUsers = {};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email & password required' });

    // uniqueness check (in-memory)
    if (Object.values(transientUsers).find((u) => u.email === email)) {
      return res.status(400).json({ error: 'email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const user = { id, email, passwordHash: hashed };
    transientUsers[id] = user;

    // Return user without password
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = Object.values(transientUsers).find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    // Return user minimal info — frontend persists in localStorage (MVP)
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;