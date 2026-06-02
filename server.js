import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/api/gemini', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key' });

  const { system = '', messages = [], maxTokens = 1000 } = req.body;
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
        else if (p.type === 'image' && p.source?.data) {
          parts.push({ inlineData: { mimeType: p.source.media_type || 'image/jpeg', data: p.source.data } });
        }
      }
    }
    if (parts.length) contents.push({ role, parts });
  }

  if (!contents.length || contents[contents.length-1].role === 'model') {
    contents.push({ role: 'user', parts: [{ text: 'Please respond.' }] });
  }

  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: Math.min(maxTokens * 2, 8192), temperature: 0.7 } }) }
  );
  const data = await geminiRes.json();
  if (!geminiRes.ok) return res.status(500).json({ error: data.error?.message });
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  res.json({ text });
});

app.listen(process.env.PORT || 3001);
