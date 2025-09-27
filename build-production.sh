#!/bin/bash

echo "🚀 Preparando build de produção para SimbioIA..."

# Limpar build anterior
rm -rf dist/

# Definir variáveis de ambiente
export REACT_APP_API_URL="https://y0h0i3c8gyog.manus.space"
export REACT_APP_ENVIRONMENT="production"
export REACT_APP_SITE_URL="https://simbioia.com.br"

# Build do projeto
echo "📦 Fazendo build..."
npm run build

# Verificar se build foi criado
if [ -d "dist" ]; then
    echo "✅ Build criado com sucesso!"
    echo "📁 Arquivos em dist/:"
    ls -la dist/
    
    echo ""
    echo "🌐 Próximos passos:"
    echo "1. Faça upload deste projeto para o GitHub"
    echo "2. Conecte o repositório no Vercel"
    echo "3. Configure o domínio simbioia.com.br"
    echo ""
    echo "📋 Ou use o Vercel CLI:"
    echo "   npm i -g vercel"
    echo "   vercel --prod"
else
    echo "❌ Erro no build!"
    exit 1
fi
