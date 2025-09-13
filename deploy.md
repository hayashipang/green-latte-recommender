# 部署到 GitHub Pages

## 步驟：

1. **創建 GitHub 倉庫**
   - 到 https://github.com 註冊/登入
   - 點擊 "New repository"
   - 命名為 "green-latte-recommender"
   - 設為 Public

2. **上傳檔案**
   - 將所有檔案上傳到 GitHub
   - 或使用 Git 命令：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/green-latte-recommender.git
   git push -u origin main
   ```

3. **啟用 GitHub Pages**
   - 到倉庫的 Settings
   - 找到 Pages 選項
   - Source 選擇 "Deploy from a branch"
   - Branch 選擇 "main"
   - 點擊 Save

4. **獲得網址**
   - 幾分鐘後，你的網站會在：
   `https://YOUR_USERNAME.github.io/green-latte-recommender`

## 優點：
- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 全球 CDN
- ✅ 永久網址
- ✅ 支援自訂網域

## 注意：
- 需要將檔案上傳到 GitHub
- 每次更新需要重新上傳
