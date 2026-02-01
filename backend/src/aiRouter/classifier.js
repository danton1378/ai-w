/**
 * Very simple rule-based classifier for demo.
 * For production, replace with an LLM intent classifier or an ML model.
 */
function classify(prompt) {
  const p = (prompt || '').toLowerCase();
  if (/image|generate image|create an image|midjourney|stable diffusion|dalle|png|jpg/.test(p)) return 'image';
  if (/video|generate video|render video|mp4|create video|runway/.test(p)) return 'video';
  if (/code|implement|debug|fix|javascript|python|react|next.js|nextjs|html|css/.test(p)) return 'coding';
  if (/research|market|competitor|analysis|validate|survey|trend/.test(p)) return 'business';
  if (/learn|teach|explain|tutorial|how to|course/.test(p)) return 'education';
  return 'general';
}

module.exports = { classify };