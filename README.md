# 新濠影汇亲子度假营销互动展

正式题目：**新濠影汇市场营销分析——以亲子度假市场为重点**。

基于 V3 的独立发布版本，以可操作的建筑沙盘展示家庭需求、停留时长、STP、4P 与策略之间的联系。本项目是非官方课程研究，建筑模型与营销方案均保留明确的近似和待验证边界。

## 运行与部署

原生 HTML、CSS、JavaScript 与 WebGL；没有框架、安装依赖、构建步骤、CDN、在线纹理或后端。网站入口是仓库根目录的 `index.html`，所有运行资源均随仓库提供。

Vercel 使用仓库根目录，Framework Preset 为 **Other**，Build Command 留空，Output Directory 为 `.`。这些设置已写入 `vercel.json`，无需环境变量。

配置依据：[Vercel 静态配置](https://vercel.com/docs/project-configuration/vercel-json)与[跳过构建步骤](https://vercel.com/docs/builds/configure-a-build#skip-build-step)。

本地可在本目录运行：

```sh
python -m http.server 8766 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8766/`。发布到 Vercel 后直接访问分配的 HTTPS 网址。

## 互动方式

- 拖动沙盘旋转；普通滚轮和触控板继续滚动页面。
- 「＋放大 / −缩小」或聚焦画布后用 `+` / `-` 缩放，方向键旋转，`Home` 复位。
- 「地理布局 / 业务拆解」切换参考位置和分析用分离位置；直接点击建筑、标签或部件按钮进行选择。
- 「俯视」查看北向布局；「看中央开孔」聚焦一期竖向 8 字结构；复位恢复全景。
- 「舱体演示」只让 17 个观景厢沿轨道运动，可随时暂停。
- 家庭 × 停留时间改变需求、路线、业务高亮、STP 与 4P；策略同步改变路线顺序、产品和行动步骤。
- 「沿路线导览」逐个选择当前路线节点；页面底部可预览并下载当前沙盘 PNG。

## 降级与性能

- `?render=2d#model` 使用可交互二维布局，保留选择、缩放、拆解与路线。
- `?motion=reduce#model` 模拟减少动态效果；也会响应系统的减少动效设置。
- 按需绘制，离开视窗或进入后台暂停；几何预算约 5 万三角形。
- 页面可进行 5 秒前台采样。rAF 间隔反映浏览器调度，JS 提交时间不包含 GPU 完成时间；不作跨设备恒定帧率承诺。

## 文件与来源

- `index.html`、`styles.css`：网站结构与视觉样式。
- `data.js`：公开事实、研究假设、策略与来源。
- `geometry.js`、`scene.js`、`app.js`：建筑几何、渲染、选择和分析联动。
- [REFERENCE.md](REFERENCE.md) 与 `references/`：照片、园区图、地图来源及近似边界。
- [VALIDATION.md](VALIDATION.md) 与 `evidence/`：本地交互核验、运行样本及实际模型截图。
- [V2 / V3 对比图](evidence/v2-v3-comparison.png)：两版实际模型的既有导出图。

建筑照片来源为 Leigh & Orange，水乐园图来源为新濠影汇官方，地图来源为 Esri World Imagery 与 OpenStreetMap contributors。页面与来源文档保留原始链接。

本网站不是企业官方渠道，也不是现场导航图。家庭细分、定位、路线和策略是课程研究建议；正式报告前需继续核实当前营业、票务与参与规则。
