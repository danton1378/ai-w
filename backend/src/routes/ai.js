/**
 * AI routing endpoint. Receives:
 * { userId, planKey, prompt, context? }
 *
 * Steps:
 * - Classify prompt intent
 * - Select provider(s) based on plan and intent
 * - Call provider module(s) and return response
 *
 * Providers are mocked here — replace with real calls.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const aiRouter = require('../aiRouter');

const PLANS = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../plans.json'))).plans;

router.post('/route', async (req, res) => {
  try {
    const { userId, planKey = 'free', prompt, context } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    const plan = PLANS[planKey] ? PLANS[planKey] : PLANS.free;

    // aiRouter returns { providerName, response, meta }
    const result = await aiRouter.handlePrompt({ userId, plan, prompt, context });

    res.json({ ok: true, result });
  } catch (err) {
    console.error('AI route error', err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;