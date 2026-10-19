# V3 建筑与相对位置依据

研究日期：2026-10-19。模型为课堂研究沙盘，平面关系经过地图交叉核对，立面和高度经照片简化；不是测绘、施工模型或现场导航图。

## 实际查看的图像

| 证据 | 实际观察与用途 | 来源 |
|---|---|---|
| 一期正面官方照片 `references/phase1-front.jpg` | 宽曲面/折线酒店翼楼；中央高处上下叠置的两处圆形开孔；金色8字轨道嵌在一期之间；密集窗带、竖向构件与Art Deco冠部。 | [Leigh & Orange 一期项目](https://www.leighorange.com/project/studio-city/) |
| 二期日景 `references/phase2.jpg` | 两座独立玻璃塔、连续竖向线条、波折/退台冠部、浅色V形幕墙带；低矮金色棱面馆体与红紫外露管道。 | [Leigh & Orange 二期项目](https://www.leighorange.com/project/studio-city-phase-2/) |
| Marriott 官方航拍外观 | 同时看到一期竖向8字与两座现代塔，核对它们是独立建筑组。照片本身没有逐塔名称。 | [W Macau 官方照片库](https://www.marriott.com/en-us/hotels/mfmwh-w-macau-studio-city/photos/) |
| 官方水乐园图 `references/waterpark-map.webp` | 明确室内/户外分区。红紫 Teleport Tower 属于室内；蓝青黄 Highpoint Twister、园林、河道与池面属于户外。该插图没有北箭头。 | [官方水乐园](https://www.studiocity-macau.com/en/attractions/studio-city-water-park) / [园区原图](https://www.studiocity-macau.com/assets/public/styles/large/public/2025-03/sc_wp_parkmap.jpg.webp) |
| 官方销售手册，第11–12页 | 露天滑道与封闭的室内主题馆分别观察，辅助功能归类。 | [2025-09官方销售手册](https://www.studiocity-macau.com/assets/public/2025-09/SCsaleskit_ENversion-compressed.pdf) |

## 地图步骤与北向证据

已实际查看 Esri 北朝上卫星底图，并用原始 OSM XML 中的一期酒店轮廓生成叠图：`references/north-up-map.png`。图中珊瑚线是一期酒店 building:part，蓝线是整体建筑/裙房轮廓；它们不是同一个对象。

- [OSM 原始地图API](https://api.openstreetmap.org/api/0.6/map?bbox=113.558,22.138,113.565,22.145)：原始数据包含地理坐标。
- [一期酒店 way 389178768](https://www.openstreetmap.org/way/389178768)：经度113.5617320–113.5627901，纬度22.1401089–22.1419088。模型将该轮廓转换为相对米制平面，立面沿轮廓概括。
- [整体建筑 way 389178769](https://www.openstreetmap.org/way/389178769) 是整个综合体的轮廓，不能当作某一座酒店塔。
- [Esri World Imagery 服务](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer)；[实际导出元数据](https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=113.5575,22.1385,113.5640,22.1430&bboxSR=4326&imageSR=4326&size=1600,1200&format=jpg&f=pjson)。实际范围经度113.5575–113.5640、纬度22.1383125–22.1431875，1600×1200；北向上、东向右。服务为匹配长宽比扩展了请求范围，因此采用返回元数据，而非只抄请求框。

交叉核对后，足以支持以下示意关系：

1. 一期酒店位于园区东侧，主体大致沿南北展开，中央高处是影汇之星。
2. 两座二期塔位于一期以西，呈北/东北与南/西南错列；没有把8字安装在二期塔上。
3. 一期与二期之间有开放水域和园林台地；模型区分酒店泳池与露天水乐园。
4. 最西侧的低矮金色棱面馆体与红紫管道，可与官方水乐园图和建筑照片匹配。中央灰色矩形屋顶保持未分类，没有仅凭形状将其归为室内水乐园。

OSM 的 Golden Reel POI 为(22.1410296,113.5618494)，本版以此作为平面相对原点。W hotel POI 为(22.1419788,113.5602315)，在其西约167米、北约106米处；水乐园一般POI为(22.1406151,113.5609556)，在其西约92米、南约46米。**这些点是POI，不是完整边界、精确入口或已测量塔中心。**

## 保留的近似与未确认项

- W 的POI与卫星图支持北侧二期塔身份，但没有独立的官方具名塔界图，所以主模型使用“二期北塔/南塔”，不把W/Epic标签写成已地图验证。
- 一期 Star/Celebrity 两翼的南北身份未独立核定，使用“一期酒店”组名。
- 卫星影像拍摄日期未知。高楼屋顶存在侧倾投影，不能将屋顶图像中心直接反算塔基。二期塔位、裙房边界、河道与植被只保留可靠相对关系。
- 水乐园插图没有北箭头，只用独特滑道与棱面结构匹配到北向影像；没有把插图左右直接解释为东西。
- 130米来自影汇之星所处高度信息，并非轮径。立面高度和窗格密度是视觉简化，无测量级比例声明。
- 餐饮与娱乐是综合体内部功能。两处标记仅提示研究触点，不新增真实独立建筑；不可用于现场导航。
- “业务拆解”施加分析用位移；“地理布局”复原参考相对位置。二者在画面中明确标示。
- “看中央开孔”是一期构造特写，临时隐藏其他建筑，让贯通开孔与17厢清楚可见；不是声称现场视线无遮挡，复位恢复全部地理上下文。

## 公开事实与研究建议

企业产品与客房口径：[公司投资者关系](https://ir.studiocity-macau.com/)；17厢与所处高度：[官方影汇之星](https://www.studiocity-macau.com/sc/attractions/golden-reel)。二期功能由[官方建筑项目说明](https://www.leighorange.com/project/studio-city-phase-2/)支持。

家庭年龄分组、定位、路线、产品草案、传播渠道和验证指标均为团队研究假设或建议；未填未经核实的票价、房价、折扣、份额或销售效果。城市旅游统计入口为[澳门旅游数据+](https://dataplus.macaotourism.gov.mo/?lang=S)，不能直接视为企业亲子客群数据。
