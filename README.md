# 新濠影汇市场营销分析 · 互动课程作业

2026-10-26 发布版，来自模型调整后的完整 V4 网站。

- 连续滚动阅读，课堂汇报与自由探索两种模式。
- 企业背景、营销环境、SWOT、STP、4P、策略与现场影像资料。
- STP / 策略装置只展示关系：金色为娱乐组合，蓝色为住宿升级，绿色为餐饮休息。
- 影像库点击触点，在装置上方打开照片或视频；支持 × 关闭、重新打开与完整查看。
- 11 张实拍照片、2 段视频与2张视频封面；研究文字保留资料来源和证据边界。

## 本地运行

使用 Node.js 22 或 24：

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## 部署

GitHub：dxia4735-stack/studio-city-marketing-exhibit（沿用原私有仓库）。
Vercel：studio-city-marketing-exhibit，生产分支 main。
构建命令 npm run build，输出目录 dist；vercel.json 明确使用 Vite。
本项目不需要环境变量或后端服务。不要提交 .env 文件、.vercel 配置或任何访问凭据。

公开包只包含所需源代码、正式现场媒体、字体与许可文件。未使用的历史第三方参考图、测试视频、QA 截图、原始作业文件与本地临时文件不包含在发布包中。此前版本仍可在 Git 历史中追溯。

## 来源与许可

本网站为课程作业在线展示，非官方网站，不代表相关企业或权利人的授权或认可。
照片和视频由本组提供，不署个人姓名。8 字地标及关系装置为研究示意。
详细来源见 public/media/CREDITS.md 和 public/REFERENCE.md；Three.js、Manrope 与地图数据的版权及许可说明随站点保留。
来源标注不代替必要的第三方许可。