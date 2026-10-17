# CYBER-AGENT AI Neon UI

## Run locally
Requires Node.js 20+.

```bash
npm install
npm run dev
```
Open the local URL Vite prints (typically http://localhost:5173).

Production build:
```bash
npm run build
npm run preview
```

## UI behavior
- Guest landing page, navigation, Gmail-style OTP modal, access-denied modal, authenticated workspace, responsive mobile layout.
- Demo OTP: `482716`. No email is sent and no real identity is verified.
- Chat replies are local demo responses; connect an authorized backend/LLM for real AI.
- Code editor text is editable in browser state; it does not save files to disk.
- Terminal output is illustrative. Commands are never executed.
- Pricing selection is UI-only; no payments are taken.
- Tool panels and security controls are UI prototypes. They do not provide actual sandboxing, authentication, authorization, or security scanning.
- Use backend-enforced auth, secure sessions, rate limiting, secret management, audit logging, and isolated tool execution before production.
