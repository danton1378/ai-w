/**
 * Centralized AI Router service
 * - classifies prompt intent
 * - picks provider modules based on plan/tier and intent
 * - handles fallback and timeouts
 *
 * For each provider we use a provider module from ../providers which returns a Promise.
 *
 * This module is intentionally small and pluggable.
 */
const classifier = require('./classifier');
const providers = {
  gemini: require('../providers/gemini'),
  kimi: require('../providers/kimi'),
  perplexity: require('../providers/perplexity'),
  chatgpt_image: require('../providers/chatgpt_image'),
  runway: require('../providers/runway'),
  mock_common: require('../providers/mock_common')
};

// Map intents to provider choices for free vs paid
const providerMap = {
  business: {
    free: ['perplexity'],
    paid: ['perplexity', 'gemini']
  },
  education: {
    free: ['mock_common'],
    paid: ['mock_common'] // NotebookLM always used on client (education)
  },
  coding: {
    free: ['kimi'],
    paid: ['gemini', 'kimi'] // combine
  },
  image: {
    free: ['chatgpt_image'],
    paid: ['chatgpt_image'] // plug higher-quality provider when available
  },
  video: {
    free: ['mock_common'],
    paid: ['runway']
  },
  general: {
    free: ['gemini'],
    paid: ['gemini']
  }
};

// Timeout in ms for provider calls (MVP)
const PROVIDER_TIMEOUT = 15000;

async function callWithTimeout(fn, args, timeout = PROVIDER_TIMEOUT) {
  return Promise.race([
    fn(args),
    new Promise((_, rej) => setTimeout(() => rej(new Error('provider timeout')), timeout))
  ]);
}

async function handlePrompt({ userId, plan, prompt, context }) {
  const intent = classifier.classify(prompt);
  const isPaid = plan && plan.price && plan.price > 0;
  const bucket = providerMap[intent] || providerMap.general;
  const choices = isPaid ? bucket.paid : bucket.free;

  // Choose first working provider, attempt in order
  let lastErr = null;
  for (const choice of choices) {
    const provider = providers[choice];
    if (!provider) continue;
    try {
      const result = await callWithTimeout(provider.run, { prompt, context, userId, plan });
      return {
        provider: choice,
        intent,
        deliveredAt: new Date().toISOString(),
        payload: result
      };
    } catch (err) {
      lastErr = err;
      console.warn(`Provider ${choice} failed:`, err.message || err);
      // try next provider
    }
  }

  // All providers failed: return fallback
  return {
    provider: 'none',
    intent,
    deliveredAt: new Date().toISOString(),
    payload: { text: 'Sorry, all AI providers failed to respond. Try again later.' },
    error: lastErr ? lastErr.message : 'no provider'
  };
}

module.exports = {
  handlePrompt
};