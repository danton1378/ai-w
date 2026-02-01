/**
 * Google Gemini stub (Free/paid mapping)
 *
 * Replace run() to call Gemini API with proper keys and response mapping.
 */
async function run({ prompt }) {
  await new Promise((r) => setTimeout(r, 800));
  return { text: `Gemini (simulated) answer for: "${prompt}"` };
}

module.exports = { run };