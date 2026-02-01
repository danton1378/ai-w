/**
 * Simulated UPI payment flow + subscription activation.
 *
 * Flow:
 * - POST /purchase { userId, planKey } -> returns paymentId, amount, upiNumber, status=pending
 * - POST /verify { paymentId, txStatus, amount } -> backend verifies and returns subscription info if OK
 *
 * NOTE: This is a simulated flow. Replace with real payment gateway in production.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const PLANS = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../plans.json'))).plans;
const UPI_TARGET = '9552586951';

// In-memory store for pending payments (MVP)
const payments = {};

router.post('/purchase', (req, res) => {
  try {
    const { userId, planKey } = req.body;
    if (!planKey) return res.status(400).json({ error: 'planKey required' });
    const plan = PLANS[planKey];
    if (!plan) return res.status(404).json({ error: 'plan not found' });

    const paymentId = uuidv4();
    const amount = plan.price;
    const payment = {
      paymentId,
      userId,
      planKey,
      amount,
      upi: UPI_TARGET,
      status: 'pending',
      createdAt: Date.now()
    };
    payments[paymentId] = payment;

    // Return simulated payment request payload
    res.json({
      paymentId,
      upi: payment.upi,
      amount,
      message: `Open your UPI app and pay ${amount} to ${payment.upi}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Verify simulated payment
router.post('/verify', (req, res) => {
  try {
    const { paymentId, txStatus, txAmount } = req.body;
    const p = payments[paymentId];
    if (!p) return res.status(404).json({ error: 'payment not found' });

    // Simulate verification: txStatus must be "SUCCESS" and amount matches
    if (txStatus === 'SUCCESS' && Number(txAmount) === Number(p.amount)) {
      p.status = 'confirmed';
      p.confirmedAt = Date.now();

      // Create subscription object for client to store locally (MVP)
      const now = Date.now();
      const months = 1;
      const expiry = new Date(now + months * 30 * 24 * 3600 * 1000);

      const subscription = {
        userId: p.userId,
        planKey: p.planKey,
        active: true,
        startedAt: now,
        expiresAt: expiry.toISOString()
      };

      return res.json({
        ok: true,
        message: 'Payment verified',
        subscription
      });
    } else {
      p.status = 'failed';
      return res.status(400).json({ ok: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;