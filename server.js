import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
 
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
 
// ── SIMPLE DATABASE (JSON file) ───────────────────────────────────────────────
const DB_FILE = '/tmp/studyquest_db.json';
 
function loadDB() {
  if (!existsSync(DB_FILE)) return { users: {} };
  try { return JSON.parse(readFileSync(DB_FILE, 'utf8')); }
  catch { return { users: {} }; }
}
 
function saveDB(db) {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
 
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'studyquest_salt').digest('hex');
}
 
function generateToken(username) {
  return crypto.createHash('sha256').update(username + Date.now() + Math.random()).digest('hex');
}
 
// ── AUTH ROUTES ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'Study Quest API running ✅' });
});
 
app.get('/api/debug', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.json({ error: 'No API key' });
  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Say hello in one word.' }] }] }) }
    );
    const data = await geminiRes.json();
    return res.json({ status: geminiRes.status, ok: geminiRes.ok, text: data.candidates?.[0]?.content?.parts?.[0]?.text });
  } catch(e) {
    return res.json({ error: e.message });
  }
});
 
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (username.length < 2) return res.status(400).json({ error: 'Username too short' });
  if (password.length < 4) return res.status(400).json({ error: 'Password too short (min 4 chars)' });
 
  const db = loadDB();
  if (db.users[username]) return res.status(409).json({ error: 'Username already taken' });
 
  const token = generateToken(username);
  db.users[username] = {
    password: hashPassword(password),
    token,
    points: 0,
    history: [],
    created: new Date().toISOString(),
    lastBonus: null
  };
  saveDB(db);
  res.json({ success: true, username, token });
});
 
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
 
  const db = loadDB();
  const user = db.users[username];
  if (!user) return res.status(401).json({ error: 'User not found' });
  if (user.password !== hashPassword(password)) return res.status(401).json({ error: 'Wrong password' });
 
  // New token on each login
  const token = generateToken(username);
  user.token = token;
  saveDB(db);
  res.json({ success: true, username, token, points: user.points, history: user.history, lastBonus: user.lastBonus });
});
 
app.post('/api/save', (req, res) => {
  const { username, token, points, history, lastBonus } = req.body;
  const db = loadDB();
  const user = db.users[username];
  if (!user || user.token !== token) return res.status(401).json({ error: 'Unauthorized' });
 
  user.points = points;
  user.history = history;
  if (lastBonus) user.lastBonus = lastBonus;
  saveDB(db);
  res.json({ success: true });
});
 
app.post('/api/delete-account', (req, res) => {
  const { username, token } = req.body;
  const db = loadDB();
  const user = db.users[username];
  if (!user || user.token !== token) return res.status(401).json({ error: 'Unauthorized' });
 
  delete db.users[username];
  saveDB(db);
  res.json({ success: true });
});
 
// ── GEMINI ROUTE ──────────────────────────────────────────────────────────────
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
 
  if (!contents.length || contents[contents.length - 1].role === 'model') {
    contents.push({ role: 'user', parts: [{ text: 'Please respond.' }] });
  }
 
  try {
    const geminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=' + apiKey,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: Math.min(maxTokens * 2, 8192), temperature: 0.7 } }) }
    );
    const data = await geminiRes.json();
    if (!geminiRes.ok) return res.status(500).json({ error: data.error?.message, status: geminiRes.status });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) return res.status(500).json({ error: 'Empty response' });
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Study Quest API v2 running on port ${PORT}`));
