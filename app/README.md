# EcommPilot (React + Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Development

```bash
cd app
npm install
npm run dev
```

## Deploy to GitHub Pages

The app deploys automatically to GitHub Pages via the workflow at
`.github/workflows/deploy.yml` on every push to `main`.

One-time setup in the GitHub repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

Once deployed, the site is available at: `https://kenzoDimona.github.io/vera/`

Notes:
- `vite.config.js` sets `base: '/vera/'` to match the repo name (the path the
  site is served from). If the repo is renamed, update this value.
- The app uses `HashRouter` so client-side routes work on GitHub Pages without
  server-side rewrites (URLs look like `.../vera/#/resultados`).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
