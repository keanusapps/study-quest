export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { system, messages, maxTokens = 1000 } = req.body;

    // Convert Claude-style messages to Gemini format
    const contents = messages.map(m => {
      const role = m.role === 'assistant' ? 'model' : 'user';
      let parts;

      if (typeof m.content === 'string') {
        parts = [{ text: m.content }];
      } else if (Array.isArray(m.content)) {
        parts = m.content.map(p => {
          if (p.type === 'text') return { text: p.text };
          if (p.type === 'image') return {
            inlineData: {
              mimeType: p.source?.media_type || 'image/jpeg',
              data: p.source?.data || ''
            }
          };
          return { text: '' };
        });
      } else {
        parts = [{ text: String(m.content) }];
      }

      return { role, parts };
    });

    // Add system prompt as first user message if provided
    if (system) {
      contents.unshift({
        role: 'user',
        parts: [{ text: `System instructions: ${system}` }]
      });
      contents.splice(1, 0, {
        role: 'model',
        parts: [{ text: 'Understood. I will follow these instructions.' }]
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ text });

  } catch (e) {
    console.error('Gemini API error:', e);
    res.status(500).json({ error: e.message });
  }
}
