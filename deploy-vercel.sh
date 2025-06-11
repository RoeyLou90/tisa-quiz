#!/bin/bash

# 確保腳本在出錯時停止執行
set -e

echo "🚀 開始部署到 Vercel..."

# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 構建前端
npm run build

# 返回專案根目錄
cd ..

# 使用 npx 部署到 Vercel
echo "🔄 正在部署到 Vercel..."
npx vercel --prod

echo "✅ 部署完成！"
echo "如果這是第一次部署，請到 Vercel 設定環境變數和部署設定。"

# 打開瀏覽器查看部署狀態
if command -v open &> /dev/null; then
    open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
fi
