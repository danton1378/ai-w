/**
 * Minimal API service with environment-based switching
 */
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 20000
});

export async function signup(email, password) {
  const res = await API.post('/api/auth/signup', { email, password });
  return res.data;
}

export async function login(email, password) {
  const res = await API.post('/api/auth/login', { email, password });
  return res.data;
}

export async function purchasePlan(userId, planKey) {
  const res = await API.post('/api/subscription/purchase', { userId, planKey });
  return res.data;
}

export async function verifyPayment(paymentId, txStatus, txAmount) {
  const res = await API.post('/api/subscription/verify', { paymentId, txStatus, txAmount });
  return res.data;
}

export async function aiRoute({ userId, planKey, prompt, context }) {
  const res = await API.post('/api/ai/route', { userId, planKey, prompt, context });
  return res.data;
}