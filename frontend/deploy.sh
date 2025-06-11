#!/bin/bash

# 確保腳本在出錯時停止執行
set -e

echo "🚀 開始部署到 Vercel..."

# 安裝 Vercel CLI（如果尚未安裝）
if ! command -v vercel &> /dev/null; then
    echo "正在安裝 Vercel CLI..."
    npm install -g vercel
fi

# 安裝依賴
npm install

# 構建前端
npm run build

# 登入 Vercel（如果尚未登入）
if ! vercel whoami &> /dev/null; then
    echo "請登入 Vercel 帳號..."
    vercel login
fi

# 部署到 Vercel
echo "🔄 正在部署到 Vercel..."
vercel --prod

echo "✅ 部署完成！"
echo "如果這是第一次部署，請到 Vercel 設定環境變數和部署設定。"

# 打開瀏覽器查看部署狀態
if command -v open &> /dev/null; then
    open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
fi
