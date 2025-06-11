#!/bin/bash

# 確保腳本在出錯時停止執行
set -e

echo "🚀 開始部署到 Vercel..."

# 進入前端目錄
cd frontend

# 安裝依賴
echo "📦 安裝前端依賴..."
npm install

# 構建前端
echo "🔨 構建前端..."
npm run build

# 返回專案根目錄
cd ..


# 使用 npx 部署到 Vercel
echo "🚀 正在部署到 Vercel..."
VERCEL_ORG_ID="" VERCEL_PROJECT_ID="" npx vercel --prod

echo "✅ 部署完成！"
echo "如果這是第一次部署，請到 Vercel 設定環境變數和部署設定。"

# 獲取部署 URL
DEPLOYMENT_URL=$(cat .vercel/project.json | jq -r '.project.aliases[0]' 2>/dev/null || echo "")

if [ -n "$DEPLOYMENT_URL" ]; then
    echo "🌐 部署網址: https://$DEPLOYMENT_URL"
    
    # 嘗試打開瀏覽器
    if command -v open &> /dev/null; then
        open "https://$DEPLOYMENT_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://$DEPLOYMENT_URL"
    fi
else
    echo "ℹ️ 請到 Vercel 控制台查看部署狀態和網址"
    if command -v open &> /dev/null; then
        open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://vercel.com/$(git config user.name)/$(basename $(pwd))/dashboard"
    fi
fi
