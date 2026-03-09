# Weekly-Mantou  每周馒头抽奖器

选择困难症。

## GitHub Pages 部署

### 本地开发

```bash
npm install
npm run dev
```

### 自动部署（推荐）

项目已包含 GitHub Actions 工作流：`.github/workflows/deploy.yml`。  
当你向 `main` 分支推送代码时，会自动构建并发布到 GitHub Pages。

### GitHub 仓库设置

1. 打开仓库 `Settings`。
2. 进入 `Pages`。
3. `Build and deployment` 中选择 `Source = GitHub Actions`。
4. 等待 `Actions` 里的 `Deploy to GitHub Pages` 工作流成功。
5. 发布地址通常是：`https://<你的GitHub用户名>.github.io/Weekly-Mantou/`

