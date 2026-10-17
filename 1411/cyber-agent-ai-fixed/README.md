# CYBER-AGENT AI — Real-time avatar edition

React + Vite dashboard with a secure Express backend for **Tavus CVI** real-time avatar sessions. The video viewport remains fixed in the left portion of the assistant panel; the adjacent dashboard chat has its own scroll container. Code editor, terminal demo, file import/save, report export, and Git branch graph remain part of the layout.

## What is and isn't live

- **Live avatar:** When configured, Start Live Avatar creates a Tavus conversation and embeds its hosted conversation URL in a fixed iframe. Tavus supplies the streamed avatar video, audio, and facial/lip movement. The dashboard does not fake lip movement with CSS.
- **True status indicator:** The green AI Online badge is rendered only while a conversation URL is active. It disappears after End Live Avatar. `/api/health` reports whether the backend and required credentials are configured.
- **Dashboard side chat:** The adjacent text chat remains a local demonstration and is not wired into Tavus's conversation transcript. Speak to the avatar using the controls inside the live avatar panel. A production implementation that mirrors Tavus transcripts into this panel requires the provider's transcript/webhook or Daily event integration.
- **Editor and terminal:** The editor supports local text/code file import and save. The terminal is intentionally simulated and does not execute arbitrary commands on the server.
- **Custom likeness:** You must create/register a compatible custom face in Tavus and set its Face ID and PAL ID. A static reference image is only the offline preview; Tavus must accept the chosen robot likeness as a compatible live face. A generic stock face will not exactly match the reference robot.

## Setup

1. Install Node.js 20+ (or a current supported Node.js version).
2. Copy `.env.example` to `.env`.
3. In `.env`, set credentials from your Tavus developer account:

   ```env
   TAVUS_API_KEY=your_tavus_api_key
   TAVUS_FACE_ID=your_custom_face_id
   TAVUS_PAL_ID=your_persona_id
   API_PORT=3001
   ```

4. Install and start both servers:

   ```bash
   npm install
   npm run dev
   ```

5. Open `http://localhost:5173`. Click **Start Live Avatar**. Approve browser microphone permission if the provider requests it. Use **End Live Avatar** to close the session and hide the online indicator.

## Production

```bash
npm install
npm run build
NODE_ENV=production npm start
```

Keep `.env` private and out of version control. Never place `TAVUS_API_KEY` in React source or any `VITE_` environment variable. Configure HTTPS and appropriate access controls before exposing the app publicly.

## Official provider docs

- Create conversation: https://docs.tavus.io/api-reference/conversations/create-conversation
- End conversation: https://docs.tavus.io/api-reference/conversations/end-conversation
- CVI overview: https://www.tavus.io/cvi
