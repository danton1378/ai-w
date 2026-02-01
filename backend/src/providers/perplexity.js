/**
 * Knowledge / research provider (Perplexity) stub
 */
async function run({ prompt }) {
  await new Promise((r) => setTimeout(r, 700));
  return {
    text: `Perplexity (simulated) research summary for: "${prompt}"`,
    citations: [{ title: 'Example Source', url: 'https://example.com' }]
  };
}

module.exports = { run };