# CYBER-AGENT AI Neon Dashboard

A responsive React + Vite + Tailwind dashboard based on the provided reference: neon completion cards, split code editor, animated blue AI assistant, chat panel, and Git branch graph.

## Run locally (Termux, Linux, macOS, Windows)

1. Install Node.js and npm.
2. Extract this project and enter the folder:
   ```sh
   cd cyber-agent-ai
   ```
3. Install dependencies (this also installs Vite, fixing `vite: not found`):
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev -- --host 0.0.0.0
   ```
5. Open the Local or Network URL Vite prints, usually `http://localhost:5173`.

## Included interactions
- Send messages in the assistant chat.
- Browser speech synthesis reads assistant replies when supported; use the speaker icon to mute/unmute.
- Robot mouth animates while speech is playing, and the robot gently floats.
- Generate Report updates the status and adds a report message.
- Reset conversation and toggle task completion.

## Note
This is a functional frontend demo. The sample code and Git graph are illustrative, and security scans/report contents are not real until you connect your own backend and AI/security APIs. Browser speech synthesis is used rather than a generated photorealistic talking-video model.
