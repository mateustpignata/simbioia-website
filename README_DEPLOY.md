# Deploy SimbioIA (React + Vite)

## Local
```bash
pnpm install   # ou npm install / yarn
pnpm dev       # ou npm run dev / yarn dev
```

## Produção (Vercel)
- Build Command: `pnpm build`
- Install Command: `pnpm install --no-frozen-lockfile`
- Output Directory: `dist`
- Não use `rewrites` para SPA Vite; a Vercel lida sozinha com fallback.

## GitHub Pages (alternativa)
Use o workflow em `.github/workflows/deploy.yml` para buildar e publicar `dist/`.

## Notas
- `/_legacy_static/style.css` e `/_legacy_static/script.js` foram preservados apenas para referência (não são usados pelo Vite).
```
