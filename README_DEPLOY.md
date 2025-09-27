# SimbioIA - Projeto React/Vite pronto

Este pacote está pronto para rodar como **app React/Vite**.

## Como rodar localmente
1. Instale as dependências:
   - `pnpm install` (ou `npm install` / `yarn`)
2. Rode o servidor de desenvolvimento:
   - `pnpm dev` (ou `npm run dev` / `yarn dev`)
3. Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

## Como gerar build de produção
- `pnpm build` (ou `npm run build` / `yarn build`)
- Saída ficará na pasta `dist/`.

## Deploy (Vercel)
- Conecte o repositório na Vercel e use:
  - **Framework Preset:** Vite
  - **Build Command:** `pnpm build`
  - **Output Directory:** `dist`
- O arquivo `vercel.json` já redireciona todas as rotas para `index.html` (SPA).

## Observação
Arquivos estáticos antigos foram movidos para `/_legacy_static` (não são usados no Vite).
