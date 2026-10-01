# BLX website source

这是当前网站的完整静态网站代码，包含首页、First Visit、CSS、JavaScript、图片以及本地 GSAP / ScrollTrigger 文件。

## 本地预览

解压 ZIP，打开终端并进入 blx-website 文件夹：

```bash
cd blx-website
python3 -m http.server 8000 --directory dist
```

然后在浏览器打开：

- 首页：http://localhost:8000/
- First Visit：http://localhost:8000/first-visit/

按 Ctrl+C 停止预览。也可使用 VS Code 的 Live Server，并从 dist 目录启动。

## 修改位置

- dist/index.html：首页内容
- dist/first-visit/index.html：First Visit 内容
- dist/style.css：颜色、排版和视觉效果
- dist/app.js：滚动交互和动画
- dist/assets/：图片和 GSAP 脚本
- .openai/hosting.json：当前网站的发布配置

无需 npm install 或构建。将 dist 目录的内容发布到静态网站托管服务即可。
Google Maps、在线字体和外部链接需要网络连接。

## 导出版本

网站：https://blx-bouldering-club-lesley.lesleygu912.chatgpt.site/
Git commit：7e110de20c34564bf2c555ccfba98219c0f1493b
