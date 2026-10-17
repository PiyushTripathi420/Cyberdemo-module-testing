import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const app = express();
app.use(express.json({ limit: '32kb' }));
const PORT = Number(process.env.API_PORT || 3001);
const API_BASE = 'https://tavusapi.com/v2';
const activeSessions = new Set();
const config = () => ({
  apiKey: process.env.TAVUS_API_KEY?.trim(),
  faceId: process.env.TAVUS_FACE_ID?.trim(),
  palId: process.env.TAVUS_PAL_ID?.trim(),
});

app.get('/api/health', (_req, res) => {
  const c = config();
  res.json({ ok: true, provider: 'Tavus CVI', avatarConfigured: Boolean(c.apiKey && c.faceId && c.palId), serverTime: new Date().toISOString() });
});

app.post('/api/avatar/session', async (_req, res) => {
  const c = config();
  if (!c.apiKey || !c.faceId || !c.palId) {
    return res.status(503).json({ error: 'Live avatar is not configured. Copy .env.example to .env and set TAVUS_API_KEY, TAVUS_FACE_ID, and TAVUS_PAL_ID from your Tavus account.' });
  }
  try {
    const upstream = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': c.apiKey },
      body: JSON.stringify({
        face_id: c.faceId,
        pal_id: c.palId,
        conversation_name: 'CYBER-AGENT AI Live Session',
        conversational_context: 'You are CYBER-AGENT AI, a careful cybersecurity coding assistant. Explain code and security concepts. Never claim to have scanned files or systems unless an actual authorized scan tool is connected. Do not execute code or claim to control the user device.',
        custom_greeting: 'Cyber-Agent AI is online. How can I help you with code security today?',
        require_auth: false,
        max_participants: 2,
      }),
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = data?.message || data?.error || `Tavus returned HTTP ${upstream.status}`;
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({ error: `Tavus session creation failed: ${message}` });
    }
    if (!data.conversation_url || !data.conversation_id) return res.status(502).json({ error: 'Tavus response did not include a conversation URL and ID.' });
    activeSessions.add(String(data.conversation_id));
    res.json({ conversationId: data.conversation_id, conversationUrl: data.conversation_url, status: data.status || 'active' });
  } catch (err) {
    res.status(502).json({ error: `Could not reach Tavus: ${err.message}` });
  }
});

app.get('/api/avatar/session/:id/status', async (req, res) => {
  const id = String(req.params.id || '');
  const c = config();
  if (!c.apiKey || !activeSessions.has(id)) return res.json({ online: false, status: 'ended' });
  try {
    const upstream = await fetch(`${API_BASE}/conversations/${encodeURIComponent(id)}`, {
      headers: { 'x-api-key': c.apiKey },
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return res.status(502).json({ error: data?.message || 'Could not verify Tavus session status.' });
    const status = String(data.status || 'unknown').toLowerCase();
    const online = status === 'active';
    if (!online) activeSessions.delete(id);
    res.json({ online, status });
  } catch (err) {
    res.status(502).json({ error: `Could not reach Tavus: ${err.message}` });
  }
});

app.post('/api/avatar/session/:id/end', async (req, res) => {
  const id = String(req.params.id || '');
  if (!activeSessions.has(id)) return res.json({ ok: true, status: 'not-tracked' });
  const c = config();
  try {
    const upstream = await fetch(`${API_BASE}/conversations/${encodeURIComponent(id)}/end`, {
      method: 'POST', headers: { 'x-api-key': c.apiKey || '' },
    });
    if (!upstream.ok && upstream.status !== 404) {
      const text = await upstream.text();
      return res.status(502).json({ error: `Could not end Tavus session: ${text || upstream.status}` });
    }
    activeSessions.delete(id);
    res.json({ ok: true, status: 'ended' });
  } catch (err) {
    res.status(502).json({ error: `Could not reach Tavus: ${err.message}` });
  }
});

// In production, serve the compiled React app from dist.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}
app.listen(PORT, '0.0.0.0', () => console.log(`CYBER-AGENT API server listening on http://localhost:${PORT}`));
