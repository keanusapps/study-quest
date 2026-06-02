export const config = { runtime: 'edge' };

export default async function handler(req) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Test 1: Key exists?
    if (!apiKey) return new Response(JSON.stringify({ error: 'No API key found' }), { headers });

    // Test 2: Call Gemini with simplest possible request
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say hello in one word.' }] }]
      })
    });

    const data = await res.json();
    
    return new Response(JSON.stringify({ 
      status: res.status,
      ok: res.ok,
      data: data 
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
