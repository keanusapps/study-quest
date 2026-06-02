export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
 
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });
 
  let body = {};
  try {
    if (req.body && Object.keys(req.body).length > 0) {
      body = req.body;
    } else {
      const buffers = [];
      for await (const chunk of req) buffers.push(chunk);
      const raw = Buffer.concat(buffers).toString();
      if (raw.trim()) body = JSON.parse(raw);
    }
  } catch(e) {
    return res.status(400).json({ error: 'Parse: ' + e.message });
  }
 
  const { system = '', messages = [], maxTokens = 1000 } = body;
  if (!messages.length) return res.status(400).json({ error: 'No messages', body });
 
  const contents = [];
  if (system) {
    contents.push({ role: 'user', parts: [{ text: 'System: ' + system }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
  }
 
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    let parts = [];
    if (typeof m.content === 'string') parts = [{ text: m.content }];
    else if (Array.isArray(m.content)) {
      for (const p of m.content) {
        if (p.type === 'text') parts.push({ text: p.text });
        else if (p.type === 'image' && p.source?.data) parts.push({ inlineData: { mimeType: p.source.media_type || 'image/jpeg', data: p.source.data } });
      }
    }
    if (parts.length) contents.push({ role, parts });
  }
 
  if (!contents.length || contents[contents.length - 1].role === 'model') {
    contents.push({ role: 'user', parts: [{ text: 'Please respond.' }] });
  }
 
  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: Math.min(maxTokens * 2, 8192), temperature: 0.7 } }) }
    );
    const data = await geminiRes.json();
    if (!geminiRes.ok) return res.status(500).json({ error: data.error?.message, status: geminiRes.status });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return res.status(500).json({ error: 'Empty', raw: data });
    return res.status(200).json({ text });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
