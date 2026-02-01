/**
 * Image generation stub for ChatGPT Free Image Generation (MVP).
 * Real integration would return image URLs or base64 payloads.
 */
async function run({ prompt }) {
  await new Promise((r) => setTimeout(r, 1200));
  // Return simulated image metadata
  return { imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(prompt)}` };
}

module.exports = { run };