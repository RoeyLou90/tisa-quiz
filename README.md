# TISA 投資人格測驗

這是一個投資人格測驗的網頁應用程式，用於評估使用者的投資風格和偏好。

## 功能特點

- 響應式設計，支援各種裝置
- 流暢的用戶體驗
- 即時進度顯示
- 詳細的投資人格分析
- 可分享的測驗結果

## 技術棧

### 前端

- Vue.js 3
- Vue Router
- Axios
- Tailwind CSS (可選)

### 後端

- Node.js
- Express
- CORS
- Helmet (安全)
- Rate Limiting (請求限制)

## 安裝與設定

### 必要條件

- Node.js 14.0 或更新版本
- npm 6.0 或更新版本

### 後端設定

1. 進入後端目錄：

   ```bash
   cd backend
   ```

2. 安裝依賴：

   ```bash
   npm install
   ```

3. 複製環境變數範例並設定：

   ```bash
   cp .env.example .env
   ```

4. 根據需求修改 `.env` 檔案中的設定

### 前端設定

1. 進入前端目錄：

   ```bash
   cd frontend
   ```

2. 安裝依賴：

   ```bash
   npm install
   ```

3. 複製環境變數範例並設定：

   ```bash
   cp .env.example .env.local
   ```

4. 根據需求修改 `.env.local` 檔案中的設定

## 開發

### 啟動後端開發伺服器

```bash
cd backend
npm run dev
```

### 啟動前端開發伺服器

```bash
cd frontend
npm run serve
```

### 建置生產版本

```bash
cd frontend
npm run build
```

建置後的檔案會生成在 `frontend/dist` 目錄中。

## 測試

### 執行單元測試

```bash
# 在後端目錄中
npm test

# 或在前端目錄中
npm test:unit
```

### 執行端對端測試

```bash
# 在前端目錄中
npm test:e2e
```

## 部署

### 生產環境部署

1. 建置前端：

   ```bash
   cd frontend
   npm run build
   ```

2. 啟動後端服務：
   ```bash
   cd ../backend
   npm start
   ```

### 使用 PM2 進行進程管理

建議使用 PM2 來管理 Node.js 進程：

```bash
# 全局安裝 PM2
npm install -g pm2

# 啟動應用
cd backend
pm2 start server.js --name "tisa-quiz"

# 設定開機自啟
pm2 startup
pm2 save
```

## 環境變數

### 後端 (`.env`)

```
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
SESSION_SECRET=your-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=debug
CACHE_TTL=300000
```

### 前端 (`.env.local`)

```
VUE_APP_API_URL=/api
NODE_ENV=development
```

## 貢獻

1. Fork 專案
2. 創建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

[MIT](LICENSE) 2025 TISA

## 聯絡我們

如有任何問題或建議，請聯絡開發團隊。
