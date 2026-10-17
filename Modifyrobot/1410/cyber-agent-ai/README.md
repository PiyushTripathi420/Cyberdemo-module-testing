# CYBER-AGENT AI — Neon Security Dashboard

React + JavaScript + Tailwind CSS + Vite dashboard with a fixed photorealistic assistant portrait, independently scrolling chat, editable code workspace, terminal simulator, file import, voice responses, report action, and Git branch visualization.

## Run locally (including Termux)

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Open the local URL printed by Vite (normally `http://localhost:5173`). For production:

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## Dashboard interactions

- Select files in Explorer, edit the code buffer, and save it.
- Use **Select File** to load a local text/code file into the editor.
- **Run** logs a simulated run into the visible terminal. It does not execute arbitrary code in the browser.
- Terminal commands are simulated for safe demonstration; run actual commands in your system terminal.
- Chat supports browser speech synthesis. Mute it with the speaker button.
- The local security review checks a few code patterns only. It is not a complete security scanner.

## Production note

Connect an authenticated backend for real AI responses, real terminal execution, security scanning, and report persistence. Do not expose model API keys in frontend code.
