export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  try {
    const { system, messages, maxTokens = 1000 } = req.body;

    const contents = [];

    if (system) {
      contents.push({ role: 'user', parts: [{ text: `Instructions: ${system}` }] });
      contents.push({ role: 'model', parts: [{ text: 'Understood.' }] });
    }

    for (const m of messages) {
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

    if (contents.length === 0 || contents[contents.length - 1].role === 'model') {
      contents.push({ role: 'user', parts: [{ text: 'Please respond.' }] });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: Math.min(maxTokens * 2, 8192), temperature: 0.7 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return res.status(500).json({ error: 'Empty response from Gemini' });

    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

