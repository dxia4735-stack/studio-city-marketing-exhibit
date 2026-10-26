# 现场资料、测试素材与来源

本目录服务于《新濠影汇市场营销分析》课程作业的在线展示。更新日期：2026-10-26。用于课程作业在线展示、课堂汇报及校内提交，非官方网页；来源标注不表示品牌授权或官方认可。

## 当前现场展示资料

当前照片、视频及视频封面放在 `field/`，文件对应关系、输出路径、尺寸与处理方式以 [MANIFEST.json](/media/field/MANIFEST.json) 为准。素材由本组提供，统一公开署名为：**本组现场记录 · 2026年10月**。不公开个人姓名，不把个人文件夹路径写入页面或清单。

当前清单包含 11 张现场照片、2 段现场视频与 2 张视频抽帧封面，共 15 个资产；网页使用 13 条照片／视频资料记录。照片保留比例、不裁剪，最长边不超过 1920 像素；两段 MP4 为原视频副本，不转码、不改原声，分别约 13.97 秒和 37.5 秒。音频内容未作审听，播放器默认静音，完整查看可由用户控制。

2026 年 10 月是提供者说明的拍摄月份，不把转码、文件创建或视频编码日期当作拍摄日期。转码、缩放、封面提取只生成浏览器展示副本；不得补造现场画面、拍摄日期、音轨或人物陈述。视频原有音频及处理情况以清单记录为准。

资料必须与画面内容对应。建筑外观只支持可见形态观察；现场拍摄的沙盘属于模型记录，不能证明真实设备运行；看见餐饮、零售或演出空间，不等于已经验证其服务质量、家庭需求或营销效果。未取得室内项目、客房等画面时保留资料缺口，不用其他照片冒充。页面的“图中所见／研究意义／还缺什么”应同步反映这些限制。

## 已退出页面展示的历史参考

以下文件曾参与旧版建模或测试，旧档仅在本地保留供内部追溯，未包含在公开发布包；本版不再将它们用作背景、缩略图、装置贴图或完整查看内容。工程未记录第三方照片及园区图的转载授权；来源外链不等于授权证明。

| 历史文件 | 来源入口 | 当前处理 |
| --- | --- | --- |
| `phase1-front.jpg`，以及 `public/references/` 同名文件 | [Leigh & Orange · Studio City](https://www.leighorange.com/project/studio-city/) | 移出展示；保留建筑形态研究的来源外链 |
| `phase2.jpg`，以及 `public/references/` 同名文件 | [Leigh & Orange · Studio City Phase 2](https://www.leighorange.com/project/studio-city-phase-2/) | 移出展示；由本组对应实拍资料承接可观察内容 |
| `waterpark-map.webp`，以及 `public/references/` 同名文件 | [新濠影汇官方水乐园](https://www.studiocity-macau.com/en/attractions/studio-city-water-park) | 移出展示；产品及规则仍可由官方资料链接核对 |
| `public/references/north-up-map.png` | [Esri World Imagery](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer)、[OpenStreetMap 一期轮廓](https://www.openstreetmap.org/way/389178768) | 卫星叠图移出展示；历史建模过程保留于 [模型依据](/REFERENCE.md) |

上述旧图未包含在公开发布包，来源外链继续保留供研究核对。来源标注不代替必要的转载许可。

## 程序测试素材

`optical-wave.mp4` 与 `optical-wave-poster.jpg` 未包含在公开发布包，属于旧光学原型的程序测试产物，不能标为本组现场影像或研究证据。动画由数学圆环、干涉条带、渐变和确定性粒子生成，不含外部摄影、音乐或 stock footage；视频为 5 秒、960 × 540、24 fps、H.264 MP4、无音轨。生成脚本保存在原项目 `visual-effects-lab/optical-memory/public/media/generate-optical-frames.py` 与 `encode-optical-wave.ps1`，原项目不因本次改版而改写。

## 图形、地图与软件许可

- 界面箭头、关闭符号、罗盘、SVG 和关系光路由项目代码绘制；8 字图形为研究对象的地标示意，不代表取得品牌、商标或官方标识授权。
- 建筑沙盘包含 OSM 派生轮廓及位置数据：© [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)，采用 [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/)。程序建模不能省略地图数据来源。
- Three.js：Copyright © 2010–2025 three.js authors，采用 [MIT License 全文](/licenses/THREE-LICENSE.txt)。
- Manrope：The Manrope Project Authors，采用 [SIL Open Font License 1.1 全文](/fonts/OFL.txt)。原始字体版权信息和许可文件继续保留。

更多软件许可记录见 [许可目录说明](/licenses/README.md)。本说明用于标明来源、用途与限制，不构成对所有内容的权利保证，也不代替必要的第三方许可。

## 后续资料维护

正式资料记录在 `src/media-data.js` 的 `MEDIA_ITEMS`；触点名称及资料关联统一在 `media-data.js` 的 `TOUCHPOINTS` 维护，`main` 直接使用。新增或替换资料时，一并更新 `credit`、`kind`、`alt`、必要的 `sourceUrl`、关联节点，以及观察、研究意义和缺失证据。公开记录继续使用“本组现场记录”，不填写个人姓名。

浏览器中的“试放本地资料”只在本次页面会话中预览，不上传、不永久写入工程，也不自动修改研究文字。正式纳入时，应把展示副本及处理记录写入 `field/` 和清单，并确认提供者允许本次课程作业在线展示。
