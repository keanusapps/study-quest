export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  try {
    // Read raw body stream
    const rawBody = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    const { system, messages, maxTokens = 1000 } = JSON.parse(rawBody);
    const contents = [];

    if (system) {
      contents.push({ role: 'user', parts: [{ text: `System: ${system}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
    }

    for (const m of (messages || [])) {
      const role = m.role === 'assistant' ? 'model' : 'user';
      let parts = [];
      if (typeof m.content === 'string') {
        parts = [{ text: m.content }];
      } else if (Array.isArray(m.content)) {
        for (const p of m.content) {
          if (p.type === 'text') parts.push({ text: p.text });
          else if (p.type === 'image' && p.source?.data) {
            parts.push({ inlineData: { mimeType: p.source.media_type || 'image/jpeg', data: p.source.data } });
          }
        }
      }
      if (parts.length > 0) contents.push({ role, parts });
    }

    if (!contents.length || contents[contents.length - 1].role === 'model') {
      contents.push({ role: 'user', parts: [{ text: 'Please respond.' }] });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: Math.min(maxTokens * 2, 8192), temperature: 0.7 }
      })
    });

    const data = await geminiRes.json();
    if (!geminiRes.ok) return res.status(500).json({ error: data.error?.message, details: data });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return res.status(500).json({ error: 'Empty response', raw: data });

    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
