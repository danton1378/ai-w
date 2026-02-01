/**
 * Runway video generation stub for paid tiers
 */
async function run({ prompt }) {
  await new Promise((r) => setTimeout(r, 2000));
  return { videoUrl: `https://example.com/video/${encodeURIComponent(prompt)}` };
}

module.exports = { run };