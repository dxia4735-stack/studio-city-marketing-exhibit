// Approved research copy; official-source examples checked on 2026-10-26.
// Facts, proposed mechanisms and planned validation remain distinct.
// Independent of the DOM and renderers so all 18 combinations can be checked.
export const CHAPTERS = [
  { id: 'opening', number: '00', title: '新濠影汇市场营销分析', eyebrow: 'STUDIO CITY / MARKETING STUDY', duration: '0.5 分钟', summary: '从企业与市场出发，以亲子市场为重点，分析现有营销组合并提出优化策略。' },
  { id: 'enterprise', number: '01', title: '一座综合度假村，多种出游理由。', eyebrow: 'ENTERPRISE & SPACE', duration: '1.5 分钟', summary: '认识企业背景、业务组合与空间关系，明确整体经营与亲子研究切口的关系。' },
  { id: 'environment', number: '02', title: '市场在增长，选择也在变化。', eyebrow: 'MARKET & ENVIRONMENT', duration: '2 分钟', summary: '从政策、消费、客源和数字渠道，分析外部变化如何影响企业的营销选择。' },
  { id: 'swot', number: '03', title: '把资源优势，转化为竞争策略。', eyebrow: 'SWOT / FACTS & ANALYSIS', duration: '1.5 分钟', summary: '将企业优势与市场机会相连，同时用具体措施应对购买障碍和竞争压力。' },
  { id: 'stp', number: '04', title: '从整体市场，聚焦亲子需求。', eyebrow: 'SEGMENT / TARGET / POSITION', duration: '2 分钟', summary: '先说明市场细分与目标选择标准，再用三类家庭展示定位如何落到产品。' },
  { id: 'mix', number: '05', title: '从产品组合，到完整购买决策。', eyebrow: 'MARKETING MIX / 4P', duration: '2.5 分钟', summary: '用官方案例与现场资料分析产品、价格、渠道和传播，说明机制、取舍及验证方法。' },
  { id: 'strategy', number: '06', title: '把营销判断，变成执行方案。', eyebrow: 'FROM PROPOSAL TO ACTION', duration: '2 分钟', summary: '按先信息、再产品、后传播的顺序，明确目标、执行角色、资源与衡量指标。' },
  { id: 'evidence', number: '07', title: '现场资料库：让判断有据可查。', eyebrow: 'APPENDIX / FIELD EVIDENCE', duration: '0.5 分钟', summary: '按需展开本组现场资料；正文中的论点与对应照片相连，附录保留完整查看入口。' },
  { id: 'closing', number: '08', title: '以清楚的价值，连接产品与市场。', eyebrow: 'CONCLUSIONS & REFERENCES', duration: '0.5 分钟', summary: '汇总企业营销结论、亲子市场建议及证据边界，保留来源与版权说明。' },
];

export const RESEARCH_QUESTION = '新濠影汇如何利用综合度假村资源服务亲子市场？现有营销组合有哪些优势与不足，未来应如何优化？';
export const ENTERPRISE_PARAGRAPHS = [
  '新濠影汇位于澳门路氹，是新濠博亚娱乐运营的电影主题综合度假村，于2015年10月开业，业务涵盖酒店住宿、娱乐体验、餐饮、零售及博彩。其鲜明的电影主题与“8字形”影汇之星，构成容易辨认的目的地形象。',
  '2023年，二期项目分阶段投入运营，新增室内水乐园、映星汇及澳门W酒店，进一步扩展住宿与非博彩娱乐产品。',
  '企业的营销问题，是如何把住宿、娱乐、餐饮与零售的资源组合转化为不同游客愿意选择的价值。本组以非博彩亲子市场为重点，检验现有产品、价格、渠道与传播是否相互配合；家庭类型和停留时间用于展示细分需求，并不代表企业只服务家庭游客。',
];
export const ENTERPRISE_OVERVIEW = ENTERPRISE_PARAGRAPHS[2];
export const COMPETITION_NOTE = '澳门银河官网将天浪淘园列为住客住宿包含权益，覆盖入住至退房期间。家庭应在相同日期、人数、停留长度和必要权益下比较总支出，同时核对参与限制与退改条件，不能仅凭门票起价判断整趟行程价值。';
export const ANALYSIS_BOUNDARY = '年龄区间是本组分析维度；具体项目是否适合，须核对身高、陪同及场馆规则。家庭需求、目标优先级、定位、路线与改进建议均需检验。城市统计不能直接代表新濠影汇亲子客群，计划采用的指标不代表已有销售效果。';
export const MODEL_BOUNDARY = '平面关系依据 OpenStreetMap 一期酒店轮廓与既有北向地图校核，建筑体量和高度经简化。餐饮与娱乐采用区域标记；满纷乐园在地理沙盘中只列为业务触点，未标注位置，在光路装置中使用独立抽象节点。满纷乐园是室内干式游乐，不是室内水乐园；户外池面作为分区与园林观察，不据此认定酒店专属设施或使用权限。模型不是测绘、施工复原或现场导航。';
export const ROUTE_BOUNDARY = '光路表示体验组合或策略呈现重点；顺序来自研究方案，不表示实测步行方向、地理距离、耗时或现场可达性。';
export const PENDING_TASKS = ['同日期家庭总价对照', '权益与参与条件核对', '家庭理解任务测试', '实际使用与选择验证'];

const cited = (title, url, note = '') => ({ title, url, note: `${note}${note ? '；' : ''}资料核查日：2026-10-26。` });
const references = {
  company: cited('新濠影汇 · 2025 年报', 'https://ir.studiocity-macau.com/static-files/175dc28c-2178-4f64-b06d-aa5f02886b52', '企业背景及2015年开业记录；年报于2026年3月提交'),
  phase2: cited('新濠博亚娱乐 · 2023 年二期开放公告', 'https://ir.melco-resorts.com/news-releases/news-release-details/melco-unveils-thrilling-all-weather-indoor-waterpark-and-epic', '2023年4月6日室内水乐园及映星汇开放'),
  melcoReport: cited('新濠博亚娱乐 · 2023 年报', 'https://ir.melco-resorts.com/static-files/f9bc18cb-4300-4abb-83ce-4e83e7af7a01', '2023年9月8日澳门W酒店开放'),
  visitors: cited('澳门统计暨普查局 · 2025 全年旅客统计', 'https://www.gov.mo/zh-hant/news/1212182/', '澳门整体入境、不过夜及留宿旅客统计，不代表企业亲子客群'),
  spending: cited('澳门统计暨普查局 · 2025 旅客消费统计', 'https://www.gcs.gov.mo/news/detail/zh-hant/N26BFn2Rot', '旅客非博彩消费总额及人均变化，不能直接推断企业销售表现'),
  stayPlay: cited('新濠影汇 · Stay and Play 住宿套票', 'https://www.studiocity-macau.com/en/offers/stay-and-play-hotel-package', '住宿与两人娱乐权益；公布预订及入住期截至2026年12月31日，不承诺实时库存'),
  familyPlay: cited('新濠影汇 · 满纷乐园票务与规则', 'https://www.studiocity-macau.com/en/attractions/super-fun-zone', '票价示例按两张成人票及一张普通小童票计算；特殊票种、日历和参与规则另查'),
  water: cited('新濠影汇 · 水乐园分区与规则', 'https://www.studiocity-macau.com/en/attractions/studio-city-water-park', '室内、户外水上体验；满纷乐园为干式游乐，户外池面不单凭照片认定使用权限'),
  ferry: cited('新濠影汇 · 水乐园航旅套票（历史营销案例）', 'https://studiocity-macau.com/en/offers/water-park-ferry-package', '按英文专页：预订截至2026年10月30日、适用截至11月1日；11月3日课堂汇报时按历史案例分析'),
  disney: cited('新濠影汇 · Disney Palette of Happiness（历史营销案例）', 'https://www.studiocity-macau.com/en/events/disney-palette-of-happiness', '官方公布活动期截至2026年11月1日；11月3日课堂汇报时按历史案例分析，现场入口照片不证明主题舱内部体验'),
  galaxy: cited('澳门银河 · 天浪淘园住客权益', 'https://www.galaxymacau.com/grand-resort-deck/', '住宿包含的使用权益作为竞争参照；比较仍须采用同日期、人数、停留与退改条件'),
  policy: cited('澳门特区政府 · 经济适度多元发展规划（2024—2028年）', 'https://www.dsepdr.gov.mo/zh-hans/news/597', '2023年11月1日正式公布；综合旅游休闲、会展商贸及文化体育等产业方向'),
  digital: cited('澳门旅游局 · 多渠道与多元客源推广', 'https://www.gov.mo/zh-hans/news/804120/?noredirect=zh_hans', '2025年1月23日发布；社交媒体、搜索、电商及线上旅行社合作为目的地营销背景，不是新濠影汇渠道业绩'),
};

export const MARKET_CONTEXT = {
  paragraphs: ['2025年澳门不过夜旅客人次增长24.6%，留宿旅客人次增长3.1%；同期旅客非博彩总消费增长6.3%，人均非博彩消费下降7.3%。客流增长与人均消费下降并存，意味着企业不能仅依靠到访量扩大，而需要说明消费价值、提高产品匹配度。对亲子市场，本组将这一问题具体化为“一天能体验什么、住一晚增加什么、全家合计花多少”。这些是由城市数据提出的研究方向，不能直接当作新濠影汇的客群或销售结论。'],
  sources: [references.visitors, references.spending],
};
export const STP_OVERVIEW = [
  '整体市场：综合度假村可以按出游目的区分休闲度假、亲子娱乐、观景购物、演出活动及商务住宿等需求，再交叉考虑客源地、预算和停留时间。这是本组用于分析的细分框架，并非已获得的企业客群占比。',
  '选择亲子切口：现有住宿套票、满纷乐园、水乐园与影汇之星，提供了可直接检验的产品组合。亲子购买还同时涉及家长付款、儿童参与和同行者照护，能够检验企业是否把多业态优势转化为清楚的顾客价值。',
  '缩小研究范围：本组优先讨论一日或一晚短假的家庭，并用幼儿、学龄、跨代三类情境比较需求。停留时间只是行为细分变量；重点仍是目标选择、定位及4P配合，而不是为所有游客设计行程。',
];
export const STP_CRITERIA = [
  ['可识别', '按同行成员、停留时间、预算与参与条件描述需求；年龄分组不能替代项目身高和陪同规则。'],
  ['可触达', '官方产品页、现有场内推广与相关内容可作为触点；渠道选择仍需用触达成本及有效咨询验证。'],
  ['产品适配', '优先选择能够共同使用现有娱乐与住宿权益的家庭，比较适用项目、可安排时间与休息需求。'],
  ['经济可行', '比较家庭总价、可用权益与企业服务成本；未取得客群规模和利润数据前，不把适配度等同于最高收益。'],
];
export const STP_INTRO = '细分：家庭之间的差异来自共同参与、照护与休息需求，也来自人数、停留和预算。下面三类情境用于比较产品适配，不是对所有家庭行为的定论；年龄分组须与真实身高、陪同和场馆规则分开判断。';
export const STP_TARGET = '本组建议优先测试“学龄儿童同行、计划一日或一晚短假”的家庭。理由是现有水上娱乐、观景和住宿产品具有较多组合可能，适合比较一日与留宿方案。幼儿家庭和跨代家庭作为需要进一步核实服务条件的补充细分市场。该优先级依据产品适配提出，不代表已经证实这一客群规模最大或利润最高。';
export const STP_POSITION = '面向希望在有限假期内共同体验多种娱乐的家庭，将新濠影汇定位为“能够按家庭成员与停留时间组合的电影主题亲子短假目的地”。传播重点是让家长看懂可参与内容、家庭总价与行程节奏。';
export const COPYRIGHT_PARAGRAPHS = [
  '本页为《新濠影汇市场营销分析》课程作业，用于课程作业的在线展示、课堂汇报与校内提交，非官方网站，不代表相关企业或权利人的授权或认可。',
  '现场照片由本组提供，不公开个人姓名。页面光路、交互及示意图由本项目程序绘制；8字图形为地标示意。文中涉及的企业名称、商标、角色形象及引用资料，其相关权利归各自权利人。',
  '地图数据：© OpenStreetMap contributors，ODbL 1.0。字体：Manrope，SIL Open Font License 1.1。三维引擎：Three.js，MIT License。具体资料来源与许可链接列于下方。',
];

export const FAMILIES = {
  young: {
    name: '幼儿家庭', tag: '0–5 岁 · 分析分组', index: '01 / SEGMENT', color: '#e6ba86',
    description: '家长需要判断孩子能否参与、何处休息，以及能否随时调整行程。共同游玩与照护便利优先于项目数量。',
    need: '共同游玩 · 照护便利 · 弹性休息',
    position: '为幼儿同行家庭说明符合条件的低龄区域、陪同要求与休息安排，让行程可以灵活调整。',
    target: '作为补充细分市场，先核实低龄区域、照护便利与参与条件，再检验家庭需求。',
    dayProduct: '满纷乐园中符合条件的低龄区域＋餐饮休息',
    nightProduct: '酒店住宿休息＋满纷乐园中符合条件的低龄区域＋餐饮休息',
    dayRoute: ['familyPlay', 'dining'], nightRoute: ['phase1', 'familyPlay', 'dining'],
  },
  school: {
    name: '学龄家庭', tag: '6–12 岁 · 分析分组', index: '02 / SEGMENT', color: '#83cbd0',
    description: '更适合检验共同参与、多种体验与活动强度之间的组合需求，同时关注家长付费和儿童兴趣的协调。',
    need: '共同参与 · 多种体验 · 活动强度',
    position: '为学龄儿童同行家庭组合共同体验与休息，说明一日和一晚短假的不同价值。',
    target: '优先测试计划一日或一晚短假的学龄儿童同行家庭；依据产品适配提出，不代表规模最大或利润最高。',
    dayProduct: '符合条件的水上体验＋影汇之星＋餐饮，集中安排一日核心体验',
    nightProduct: '酒店＋符合条件的水上体验＋影汇之星＋餐饮，分两天安排活动与休息',
    dayRoute: ['outdoor', 'reel', 'dining'], nightRoute: ['phase1', 'outdoor', 'reel', 'dining'],
  },
  multi: {
    name: '跨代同行', tag: '祖辈与孩子 · 分析分组', index: '03 / SEGMENT', color: '#bba8dc',
    description: '同行成员兴趣和体力不同，需要共享活动，也需要允许部分成员休息或分开参与。',
    need: '共享活动 · 分段参与 · 弹性休息',
    position: '为跨代家庭提供共同活动与可分开参与的选择，让不同体力和兴趣的成员都能安排节奏。',
    target: '作为补充细分市场，先了解同行人数、休息和房型需求，并核实服务条件。',
    dayProduct: '观景＋餐饮＋可选娱乐，允许部分成员休息或分开参与',
    nightProduct: '酒店＋观景＋餐饮＋可选娱乐，增加弹性休息',
    dayRoute: ['reel', 'dining'], nightRoute: ['phase1', 'reel', 'dining'],
  },
};

export const STRATEGIES = {
  journey: { name: '旅程模块化', letter: 'A', summary: '从组合设计入手', channel: '专题行程页 → 官方产品信息与预订入口', suffix: '的可选路线卡', promotion: '用一日与留宿路线说明项目衔接；开放、活动与库存另行核验。' },
  content: { name: '情境内容触达', letter: 'B', summary: '从内容与渠道入手', channel: '家庭情境短内容 → 官方专题页 → 产品预订入口', suffix: '的家庭情境内容', promotion: '按家庭情境介绍真实可参与的体验，把规则与预订链接到官方页。' },
  service: { name: '预订信息服务', letter: 'C', summary: '从决策摩擦入手', channel: '官方信息页与客服常见问题（需确认承接）', suffix: '的行前信息清单', promotion: '整理适用规则、项目衔接和家庭常见问题，核对服务承接方式。' },
};

// Proposed implementation responsibilities and resources; not a claim about the company's internal organisation.
export const STRATEGY_PLANS = {
  journey: {
    title: '产品组合：核心体验＋可选模块',
    goal: '提高现有资源与目标需求的匹配度，让单项游玩与住宿升级各有清楚价值。',
    basis: 'S×O：已有跨项目套票与短途客流机会；S×T：以电影主题、观景及室内娱乐的组合差异回应竞争。',
    priority: '第二优先 · 第3—4周建议试点；以票务与权益信息先统一为前提。',
    owner: '建议由产品／营销负责人统筹，酒店、娱乐与餐饮运营共同确认权益和承接条件。',
    resources: '以现有设施、库存与销售页面为基础；需要价格和成本核算、日期容量表、统一产品说明，无须先新增大型设施。',
    steps: [
      '选择两类小范围组合：一日核心体验，以及住宿加可选娱乐；明确包含人数、儿童规则、替代选择与退改条件。',
      '按同一日期和家庭人数，与单项购买及竞品包含权益作对照；仅保留顾客实际可用且企业收益可承受的组合。',
      '分平日与周末试点，记录项目使用、未使用原因和服务问题，再决定扩大或删减模块。',
    ],
    metrics: ['权益实际使用率及未使用原因', '可选模块加购情况与跨项目使用', '取得内部数据后比较每单贡献毛利及服务成本'],
  },
  content: {
    title: '传播承接：用具体情境说明价值',
    goal: '把注意力转化为产品理解与有效购买行动，减少只记住场景却不理解权益的问题。',
    basis: 'STP的需求差异与4P传播案例：场景、角色和短内容能够引发兴趣，产品信息必须承接下一步决策。',
    priority: '第三优先 · 第5—6周建议试点；待产品与信息口径确认后投放。',
    owner: '建议由内容／营销团队制作，电子商务团队维护对应页面，运营及客服核对表达和常见问题。',
    resources: '优先使用可用的真实影像、既有官方渠道与产品页面；少量内容制作及试投资源，预算需依据基线另定。',
    steps: [
      '先制作学龄家庭共同体验与跨代弹性参与两种内容；同时写明适合谁、包括什么、适用日期和预订入口。',
      '每种内容连接对应产品页面，保持名称、人数、规则与价格口径一致；限时活动到期后转为历史内容。',
      '在可比受众和日期下测试不同表达，沿内容点击、权益理解、有效咨询到订单逐步比较；无订单权限时仅报告前段结果。',
    ],
    metrics: ['内容到对应产品页的点击情况', '权益理解度及有效咨询占比', '有权限时追踪预订完成与获客成本，不以浏览量代替销量'],
  },
  service: {
    title: '信息服务：先解决“全家怎么选”',
    goal: '减少查找和计算成本，让顾客能正确判断家庭总价、参与条件与购买步骤。',
    basis: 'W×T：两人套餐权益与家庭人数未必一致，竞争又发生在整趟行程的总价值上；先修复比较基础。',
    priority: '第一优先 · 第1—2周建议完成；投入相对集中，并为产品和传播提供统一依据。',
    owner: '建议由电子商务／官网负责人牵头，联合票务、酒店运营与客服审核和定期更新。',
    resources: '现有条款、票价日历、客服问题及页面编辑资源；准备固定人数的比较表和简短任务测试。',
    steps: [
      '以“两名成人＋一名儿童”等明确人数建立已包含、需加购、需核实三栏；标注核查日期，不把示例价格作为实时承诺。',
      '把儿童参与规则、兑换、退改与官方购买入口放在对应产品旁，并安排信息更新责任。',
      '用相同题目比较旧页与新页的总价计算和规则查找表现；先取得基线，再设改进目标和后续试点规模。',
    ],
    metrics: ['家庭总价计算正确率', '规则查找成功率与完成时间', '相关重复咨询及预订步骤中的退出情况'],
  },
};

export const ENVIRONMENTS = {
  macro: {
    kicker: 'MACRO / PEST', heading: '外部变化，如何影响营销选择？', summary: '以公开事实为起点，解释企业影响，再给出本组应对判断。',
    items: [
      ['P', '政策：多元旅游价值', '事实：澳门2024—2028年经济适度多元发展规划涉及综合旅游休闲、会展商贸及文化体育。企业影响：新濠影汇的非博彩娱乐、住宿和活动资源，有机会与更丰富的到访动机连接。本组应对：把主题娱乐与住宿、餐饮组合成明确产品，评价实际使用和收益，不把政策方向直接当作企业增长保证。'],
      ['E', '经济：客流与消费不同步', '事实：2025年澳门非博彩旅客消费总额上升、人均消费下降。企业影响：更多到访机会并不等于每位游客愿意提高预算，价格与权益需要共同解释。本组应对：展示同日期、同人数的可用权益及总价，以价值差异回应竞争，避免只强调低起价或无差别折扣。'],
      ['S', '客源结构：近程市场机会', '事实：2025年大湾区内地九市来澳旅客增长23.7%，不过夜客流增幅高于留宿客流。企业影响：短时到访的接触机会扩大，但城市统计不说明其中有多少家庭。本组应对：把短假家庭作为待验证切口，分别说明一日购买与留宿升级价值，保留其他休闲客群的产品选择。'],
      ['T', '数字渠道：内容与购买相连', '事实：澳门旅游局公布的推广方式包括社交媒体、搜索、电商与线上旅行社合作。企业影响：游客可能跨平台了解目的地，信息不一致会增加购买判断成本。本组应对：让情境内容通往对应产品页，统一日期、人数与规则，并分开衡量浏览、理解和购买。'],
    ],
    sources: [references.policy, references.spending, references.visitors, references.digital],
  },
  micro: {
    kicker: 'MICRO / PARTICIPANTS', heading: '产品价值，需要参与者共同实现。', summary: '用现有套票、规则和竞品案例，分析企业与顾客、渠道及伙伴之间的关系。',
    items: [
      ['企', '企业：多业态协同', '事实：Stay and Play已把住宿与多项娱乐权益组合。影响：企业拥有交叉销售基础，但顾客未必能在同次到访中用完。应对：以核心体验加可选模块组织产品，酒店、票务和现场运营共同审核容量与适用规则。'],
      ['客', '顾客：付款者与参与者不同', '事实：满纷乐园区分成人、小童票和参与条件，住宿套餐则有两人权益。影响：亲子购买需要同时判断人数、参与资格及额外支出。应对：按明确家庭人数解释权益与总价；不同家庭的偏好仍需访问和选择测试确认。'],
      ['竞', '竞争者：住宿包含娱乐的参照', '事实：银河天浪淘园向住客提供住宿包含权益。影响：消费者可以按整趟住宿加娱乐的价值进行比较，单项门票或设施数量不足以说明优势。应对：按同日期、人数、权益与退改条件比较，并突出新濠影汇的主题和体验组合差异。'],
      ['渠', '渠道：协作带来便利，也带来条件', '事实：水乐园航旅套票把香港往返澳门船票与入园组合。影响：交通和娱乐可共同吸引到访，但日期及兑换规则增加信息负担。应对：统一推广、产品页与购买入口的名称和条款；该限期活动在11月3日汇报时作为历史案例。'],
      ['伙', '伙伴：承诺依赖协同兑现', '事实：航旅组合涉及运输和景点，Disney限期活动涉及主题体验与多个场内触点。影响：合作增加内容与触达机会，使用条件和到期下架也须同步。应对：建议建立活动日期、权益、素材及客服说明的共同清单；不据此推断合作合同或企业现有管理缺陷。'],
    ],
    sources: [references.stayPlay, references.familyPlay, references.galaxy, references.ferry, references.disney],
  },
};

export const SWOT = [
  {
    code: 'S', title: '多项目组合的协同潜力', status: '公开案例 · 机制分析',
    summary: '住宿、娱乐和地标体验能够组合，优势在于共同形成出游理由。',
    paragraphs: [
      '官网“Stay and Play”将一晚住宿与两人的满纷乐园、影汇之星门票及传奇英雄科技城游戏点组合销售。这说明新濠影汇已经具备跨项目组合产品的基础。',
      '从营销机制看，标志性观景体验提供目的地记忆，亲子娱乐提供参与内容，住宿则为分配活动与休息提供条件。它们相互配合，有机会把“专程体验一个项目”延伸为“安排一次短假”。',
      '不过，资源集中不会自动产生协同效果。如果活动时间难以衔接，或者孩子不能参与部分项目，套餐中的权益就未必有价值。因此，本组建议围绕家庭实际可使用的体验组织组合，并以权益理解度、项目实际使用情况和跨项目消费进行验证。',
    ],
    sources: [references.stayPlay, references.water],
  },
  {
    code: 'W', title: '购买单位与家庭结构未必一致', status: '公开条件 · 待验证问题',
    summary: '产品组合的计价单位与家庭结构未必一致，家庭仍需自行完成多项判断。',
    paragraphs: [
      '官方住宿套餐列出的“两人娱乐权益”，不能直接说明是否覆盖“两名成人与一名儿童”；满纷乐园又分别设置成人、小童及部分低龄儿童票种，并对不同设施规定参与条件。',
      '这意味着家长可能需要同时核对房间入住人数、已有门票、额外补票和孩子可参与的项目。决策成本不仅来自价格，也来自比较所需的时间，以及对额外费用的不确定。',
      '本组建议增加“已包含／需加购／需核实”三栏说明，分别展示不同家庭人数的情况。可以通过简单任务测试，观察家长能否正确算出总价、理解权益，以及完成比较需要多久。目前这些是可检验的改进方向，不能直接写成企业已发生的销售损失。',
    ],
    sources: [references.stayPlay, references.familyPlay],
  },
  {
    code: 'O', title: '分别承接一日体验与留宿升级', status: '城市数据 · 团队建议',
    summary: '短途客流增长提供接触机会，一日体验和留宿升级需要分别设计。',
    paragraphs: [
      '2025年澳门不过夜旅客增长24.6%，留宿旅客增长3.1%；同期旅客非博彩总消费增长6.3%，人均非博彩消费下降7.3%。这说明市场接触机会扩大，但每位游客的消费增长并没有同步发生。',
      '对新濠影汇而言，一日家庭更需要明确的核心体验、时间安排和返程条件；留宿家庭则需要看懂多住一晚能够增加什么价值。两类产品可以共享部分设施，却应采用不同的利益表达。',
      '本组建议以“一日核心体验”承接短途需求，再以跨日活动、休息安排和适用权益解释留宿价值。是否能够促成留宿，需要观察实际选择，不能由澳门整体统计直接推断企业亲子客群的购买行为。',
    ],
    sources: [references.visitors, references.spending],
  },
  {
    code: 'T', title: '整趟家庭行程的价值竞争', status: '竞品权益 · 比较边界',
    summary: '竞争发生在整趟家庭行程的价值上，单项设施优势不足以完成比较。',
    paragraphs: [
      '澳门银河官网将天浪淘园列为住客住宿包含权益，覆盖入住至退房期间。这给家庭提供了“住宿包含娱乐”的购买参照。',
      '面对这种选择，新濠影汇需要解释自身组合中的独特体验、室内活动选择和使用弹性。仅强调项目多或展示门票起价，可能无法回答家庭最关心的“整趟行程值不值得”。',
      '本组建议在相同日期、人数、停留长度和必要权益下比较家庭总支出，并同时列出参与限制和退改条件。竞争策略应建立在实际差异上；持续降价还可能压缩收益，削弱消费者对体验价值的关注。',
    ],
    sources: [references.galaxy, references.stayPlay],
  },
].map((item) => ({ ...item, detail: item.paragraphs.join('\n\n') }));

export const SWOT_BRIDGE = 'SO：以现有住宿和娱乐组合承接短途到访机会；WO：先说明人数、加购及参与条件，让增长客流看懂产品；ST：用电影主题、观景与室内体验的组合差异回应住宿含娱乐的竞争参照；WT：统一总价和条款，减少比较障碍，并以成本核算约束折扣。落实顺序是先信息服务、再组合试点、后情境传播。';

export const CURRENT_MIX = [
  {
    key: 'product', en: 'PRODUCT', title: '产品',
    summary: '家庭购买的是一次共同度假，套餐应围绕可使用的体验组织。',
    question: '如何用“核心体验＋可选模块”组织一日与留宿产品，并检验权益实际使用情况？',
    paragraphs: [
      '“Stay and Play”将住宿与多项娱乐权益打包，是产品捆绑的具体案例。它让消费者更容易理解留宿能够获得的内容，也为不同业务之间的交叉销售提供机会。',
      '从家庭需求看，产品可以分为三个层次：共同陪伴与放松是核心利益；酒店、观景、游乐和餐饮是具体体验；清楚的规则、预订信息及行程安排则帮助家庭顺利使用这些体验。',
      '组合也存在取舍：权益越多，表面价值可能越高，但孩子无法参与、时间不足或兴趣不符的项目，会降低实际使用价值。因此，本组建议采用“核心体验＋可选模块”，让一日家庭集中选择，留宿家庭分两天安排，并说明不同模块的参与条件。',
      '对企业而言，组合设计也不是无限增加赠品：需要确认热门项目容量、各业务之间的权益结算及服务成本。较合适的做法是保留易理解的核心承诺，再由顾客按需求选购；是否提高收益须以成本和实际使用数据判断。',
      '评价产品时，除了购买意向，还应关注权益使用情况、未使用原因和体验衔接问题，避免把套餐项目数量直接当作产品质量。',
    ],
    sources: [references.stayPlay, references.familyPlay, references.water],
  },
  {
    key: 'price', en: 'PRICE', title: '价格',
    summary: '日期差异定价应配合家庭总价说明，优惠需要让顾客真正看懂。',
    question: '相同日期、人数、房型和退改条件下，家庭真正可用的权益与必要加购费用是什么？',
    paragraphs: [
      '以本次检索到的满纷乐园官网票表为例，平日普通小童票为澳门币180元、成人票为100元；周末及假日分别为230元、120元。按“两张成人票＋一张普通小童票”、仅计算门票且不计优惠，合计分别为380元和470元。',
      '这种结构体现了按日期区分价格的方式，有可能引导时间灵活的家庭错峰出游。但学龄家庭往往受到上学和家长工作时间限制，未必能够享受平日价格。因此，较低的平日起价不能代表所有家庭的实际支出。',
      '对于住宿套票，应比较同日期、同房型、同人数及相近退改条件下的单买与组合费用，同时剔除家庭无法使用的权益。建议明确显示必要加购费用和适用条件，让优惠建立在实际使用价值上。',
      '企业端还应区分“新增需求”与“原本会原价购买、现在改用优惠”的情况。前者可能提高闲时利用率，后者可能让利而没有新增收益；所以评价价格策略应同时观察日期分布、实际使用与贡献毛利，而不只看套票卖出数量。这里是评价方法，不代表已取得相关经营数据。',
      '票价示例核查日期为2026年10月26日；儿童特殊票种和日历分类另行说明，不作为最终预订报价。',
    ],
    sources: [references.familyPlay, references.stayPlay],
  },
  {
    key: 'place', en: 'PLACE', title: '渠道',
    summary: '渠道价值在于帮助家庭完成安排，关键是信息和购买步骤能否衔接。',
    question: '家庭能否找到正确入口、理解有效期和兑换规则，并完成相应购买步骤？',
    paragraphs: [
      '历史案例：官方水乐园航旅套票将香港往返澳门船票与水乐园入场组合销售，是交通与娱乐渠道协作的案例。其公布条款还分别规定去程、回程与入园日期的使用关系；预订截至2026年10月30日，适用截至11月1日，在11月3日课堂汇报时不再作为现售推荐。',
      '这种组合有机会减少跨境家庭分别安排交通和娱乐的步骤，同时也增加了需要说明的使用条件。如果消费者只看到“船票＋门票”，却没有理解使用日期和兑换方式，便利性就可能被规则查找成本抵消。',
      '本组建议让家庭情境内容直接连接相应产品页面，并在跳转前说明适用人数、有效期和关键限制。线下广告、官网介绍及预订页面也应使用一致的产品名称和条件。',
      '选择渠道还要权衡覆盖与可控性：伙伴触点可扩大接触机会，官方入口便于统一信息；若涉及外部销售，还需评估服务费用、订单归属与客服交接。当前公开资料不能据此判断具体佣金或渠道利润。',
      '验证时可以记录找到正确入口所需步骤、规则查找成功率和常见误解。取得实际订单与成本数据后，才能进一步比较渠道成交及获客成本；页面点击本身不能证明成交。',
    ],
    sources: [references.ferry],
  },
  {
    key: 'promotion', en: 'PROMOTION', title: '传播',
    summary: '现场曝光与角色主题能够引起兴趣，后续内容需要承接家庭的决策问题。',
    question: '内容是否回答适合谁、包括什么、何时可用和从哪里预订，并区分注意与实际购买？',
    paragraphs: [
      '小组照片中的商业街吊旗，将亲子娱乐信息放在购物动线上，属于场内交叉推广。历史案例Disney Palette of Happiness把公共主题装置、影汇之星主题舱和主题餐饮连接起来；官方活动期截至2026年11月1日，11月3日课堂汇报分析其推广机制，不暗示仍可参与。',
      '从传播机制看，熟悉的角色和醒目的场景能够提供注意与分享的理由；现场信息还可以让已经到访的游客发现其他项目。但拍照、浏览和分享，并不等于理解产品，更不能直接代表购买。',
      '本组建议在情境内容中同时回答“适合谁、包括什么、何时可用、从哪里预订”。例如，面向学龄家庭展示共同体验，面向幼儿家庭强调适用区域与陪同条件，面向跨代家庭说明共享活动和休息选择。',
      '传播也有取舍：短期主题提供新鲜感，但企业仍需让游客记住新濠影汇自身的产品价值，否则关注可能随活动结束而消退。建议用真实体验解释品牌与活动的关系，并在到期后同步更新入口、图片说明和客服口径。',
      '效果评价应依次观察注意、理解、有效咨询及实际购买，并记录受众、日期及内容版本。现场照片支持“信息被放置在什么位置”，不能单独证明曝光人数、品牌好感或销售增长。',
    ],
    sources: [references.disney, references.familyPlay],
  },
];

export const PART_TO_NODE = { phase1: 'hotel', northTower: 'hotel', southTower: 'hotel', outdoor: 'water', indoor: 'indoor', familyPlay: 'familyPlay', reel: 'reel', dining: 'dining', pool: 'pool', entertainment: 'entertainment' };
export const NODE_TO_PART = { hotel: 'phase1', water: 'outdoor', indoor: 'indoor', familyPlay: 'familyPlay', reel: 'reel', dining: 'dining', pool: 'pool', entertainment: 'entertainment' };
export const PART_SHORT_NAMES = { phase1: '一期酒店', northTower: '二期北塔', southTower: '二期南塔', outdoor: '露天水乐园', indoor: '室内水乐园', familyPlay: '满纷乐园 · 区域标记', reel: '影汇之星', dining: '餐饮 · 区域标记', pool: '户外池面（分区/园林）', entertainment: '娱乐 · 区域标记' };

export function deriveResearch({ family = 'school', stay = 'day', strategy = 'journey' } = {}) {
  const familyId = Object.hasOwn(FAMILIES, family) ? family : 'school';
  const stayId = stay === 'overnight' ? 'overnight' : 'day';
  const strategyId = Object.hasOwn(STRATEGIES, strategy) ? strategy : 'journey';
  const selected = FAMILIES[familyId];
  const chosenStrategy = STRATEGIES[strategyId];
  const stayName = stayId === 'overnight' ? '留宿一晚' : '一日体验';
  const routeLegacy = [...(stayId === 'overnight' ? selected.nightRoute : selected.dayRoute)];

  // Preserve the old controller's strategy presentation order, including service priority.
  if (strategyId === 'content') {
    const first = routeLegacy.includes('familyPlay') ? 'familyPlay' : routeLegacy.includes('reel') ? 'reel' : 'indoor';
    const index = routeLegacy.indexOf(first);
    if (index >= 0) { routeLegacy.splice(index, 1); routeLegacy.unshift(first); }
  } else if (strategyId === 'service') {
    const diningIndex = routeLegacy.indexOf('dining');
    if (diningIndex >= 0) routeLegacy.splice(diningIndex, 1);
    routeLegacy.unshift('dining');
    if (stayId === 'overnight') {
      const hotelIndex = routeLegacy.indexOf('phase1');
      if (hotelIndex >= 0) routeLegacy.splice(hotelIndex, 1);
      routeLegacy.unshift('phase1');
    }
  }
  const highlight = [...routeLegacy];
  if (highlight.includes('phase1')) highlight.push('northTower', 'southTower');
  if (highlight.includes('outdoor')) highlight.push('indoor');
  if (strategyId === 'content') highlight.push('entertainment');
  const routeText = routeLegacy.map((id) => PART_SHORT_NAMES[id]).join('、');
  const product = stayId === 'overnight' ? selected.nightProduct : selected.dayProduct;
  let actions;
  if (strategyId === 'journey') {
    actions = [
      `以${selected.name}、${stayName}为情境，将 ${routeText} 分成核心体验与可选模块。`,
      '由产品、票务与运营共同确认权益人数、必要加购和可售日期，展示同口径家庭总价。',
      '小范围试点，比较权益实际使用、未使用原因和服务成本，再调整组合。',
    ];
  } else if (strategyId === 'content') {
    actions = [
      `围绕${selected.name}的参与和休息需求，制作说明人数、适用条件与体验价值的内容。`,
      `制作 ${routeText} 的情境内容，指向官方信息与预订入口。`,
      '比较不同内容的理解度和合格咨询；记录样本及日期，避免把浏览量当销售效果。',
    ];
  } else {
    actions = [
      `为${selected.name}建立已包含、需加购、需核实三栏，说明${stayName}的总价与条件。`,
      `将 ${routeText} 的规则与购买入口连接到对应说明，安排票务及客服更新责任。`,
      '比较修改前后的总价计算正确率、规则查找时间和重复咨询，先取得基线再设目标。',
    ];
  }
  return {
    routeLegacy, routeNodes: routeLegacy.map((id) => PART_TO_NODE[id]), highlight: [...new Set(highlight)],
    need: selected.need, product, position: selected.position, target: selected.target, description: selected.description,
    hypothesis: `${selected.name}、计划${stayName}的家庭，可能适合测试上述组合；这不是已经证实的最优客群。`,
    channel: chosenStrategy.channel, promotion: chosenStrategy.promotion, actions,
    price: '按同日期、同房型、同人数与相近退改条件比较总价，列清包含权益、必要加购和儿童规则；票价示例不代表最终预订报价。',
    context: `${selected.name} / ${stayName}`,
    strategyName: chosenStrategy.name,
    strategyProduct: product + chosenStrategy.suffix,
    productCaveat: product + '；先核对项目适用条件。',
    liveMix: `${selected.name} · ${stayName}：${product}。研究建议，非现售套餐。`,
    routeNames: routeLegacy.map((id) => id === 'phase1' ? '住宿讨论点' : PART_SHORT_NAMES[id]).join(' → '),
    validation: '观察点击、咨询与选择意向，是后续测试计划；不代表已有转化率或销售成效。',
  };
}

export const SOURCES = [
  references.company, references.phase2, references.melcoReport,
  references.visitors, references.spending, references.stayPlay,
  references.familyPlay, references.water, references.ferry, references.disney, references.galaxy,
  references.policy, references.digital,
  cited('影汇之星 · 观景厢与所处高度', 'https://www.studiocity-macau.com/sc/attractions/golden-reel', '17厢与所处高度资料；130米不是模型轮径，演示速度非实测'),
  cited('OpenStreetMap · 一期建筑轮廓', 'https://www.openstreetmap.org/way/389178768', '相对平面关系的地图依据，非测绘模型'),
  cited('Leigh & Orange · 一期项目', 'https://www.leighorange.com/project/studio-city/', '原几何研究的一期形态参考；页面展示照片使用本组现场资料'),
  cited('Leigh & Orange · 二期项目', 'https://www.leighorange.com/project/studio-city-phase-2/', '原几何研究的二期形态参考；页面展示照片使用本组现场资料'),
];

export const REFERENCE_GALLERY = [
  { src: '/media/field/entrance.jpg', title: '入口与目的地形象', alt: '本组提供的新濠影汇入口现场照片', caption: '本组现场资料：观察入口形象与到访信息，不据此推断客流或销售表现。', source: '' },
  { src: '/media/field/phase2.jpg', title: '二期建筑现场观察', alt: '本组提供的新濠影汇二期建筑现场照片', caption: '本组现场资料：呈现可见建筑外观，具体产品权益以官方资料为准。', source: '' },
  { src: '/media/field/display-model.jpg', title: '现场陈列模型', alt: '本组提供的现场建筑陈列模型照片', caption: '本组现场资料：辅助理解体量和空间组织；陈列模型与本页示意均不用于现场导航。', source: '' },
  { src: '/media/field/water-overview.jpg', title: '水域与建筑关系', alt: '本组提供的新濠影汇水域及周边建筑现场照片', caption: '本组现场资料：观察户外池面、园林与周边建筑；照片不能独立确认具体分区或设施的使用权限。', source: '' },
];

export const FACTS = [
  { value: '2015', label: '10月开业 · 电影主题综合度假村', note: '澳门路氹的新濠影汇，以鲜明主题和影汇之星形成目的地形象。', source: references.company.url },
  { value: '2023', label: '二期分阶段投入运营', note: '新增室内水乐园、映星汇及澳门W酒店，扩展住宿与非博彩娱乐。', source: references.melcoReport.url },
  { value: '多业态', label: '住宿 · 娱乐 · 餐饮 · 零售', note: '综合度假村业务亦包含博彩；本组聚焦非博彩亲子度假体验及其组合价值。', source: references.company.url },
];

export const CONCLUSION_POINTS = [
  '企业营销的核心是把电影主题、住宿与娱乐资源组合成可理解、可使用的价值。现有套票提供协同基础，但项目数量、城市客流增长和传播热度均不能直接证明经营成效。',
  '亲子市场是本组的重点研究切口，家庭类型与停留长度用于检验STP和4P是否一致。本组优先测试学龄儿童同行的短假需求；这个选择依据产品适配，尚不能证明客群规模最大或利润最高。',
  '执行上先统一家庭总价与权益说明，再试点核心加可选的产品组合，最后以情境内容连接购买入口。用理解、权益使用与可取得的收益数据决定是否扩大，形成从市场分析到营销行动的闭环。',
];
