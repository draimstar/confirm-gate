# confirm-gate

Small **Next.js + TypeScript** demo of a **confirm-before-commit** gate.

- Gate state machine in `src/lib/confirmGate.ts`
- UI cannot hit the commit API without an explicit confirm step
- API rejects `{ confirmed: false }`
- **Vitest** unit tests for the gate
- **Playwright** e2e: cancel vs confirm paths

## Run

```bash
npm install
npm test          # Vitest
npx playwright install chromium
npm run test:e2e  # Playwright
npm run dev
```

## Why this exists

Portfolio proof for Rebound-style workflows: irreversible actions stay blocked until confirm.
