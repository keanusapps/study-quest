export const config = { runtime: 'edge' };
 
export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
 
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };
 
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), { status: 500, headers });
    }
 
    const body = await req.json();
    const { system, messages, maxTokens = 1000 } = body;
 
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
 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
 
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: Math.min(maxTokens * 2, 8192),
          temperature: 0.7,
        }
      })
    });
 
    const data = await geminiRes.json();
 
    if (!geminiRes.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Gemini error' }), { status: 500, headers });
    }
 
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
 
    if (!text) {
      return new Response(JSON.stringify({ error: 'Empty response', raw: JSON.stringify(data) }), { status: 500, headers });
    }
 
    return new Response(JSON.stringify({ text }), { status: 200, headers });
 
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers });
  }
}
