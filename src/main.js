import { createJourneyScene, JOURNEY_NODE_IDS } from './scene.js';
import { RELATION_TYPES, classifyRelation } from './relations.js';
import { createGeography } from './geography.js';
import { createCoverScene } from './cover-scene.js';
import { TOUCHPOINTS, MEDIA_ITEMS } from './media-data.js';
import { CHAPTERS, FAMILIES, STRATEGIES, ENVIRONMENTS, SWOT, CURRENT_MIX, deriveResearch,
  PART_TO_NODE, NODE_TO_PART, PART_SHORT_NAMES, RESEARCH_QUESTION, ENTERPRISE_OVERVIEW,
  COMPETITION_NOTE, ANALYSIS_BOUNDARY, MODEL_BOUNDARY, ROUTE_BOUNDARY, PENDING_TASKS,
  SOURCES, REFERENCE_GALLERY, FACTS, CONCLUSION_POINTS, ENTERPRISE_PARAGRAPHS, MARKET_CONTEXT,
  STP_INTRO, STP_TARGET, STP_POSITION, COPYRIGHT_PARAGRAPHS, SWOT_BRIDGE,
  STP_OVERVIEW, STP_CRITERIA, STRATEGY_PLANS } from './research.js';

const $ = (id) => document.getElementById(id);
// Section hashes own the initial position; native restoration must not override them.
history.scrollRestoration = 'manual';
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const titleMap = {opening:'研究封面',enterprise:'企业背景',environment:'宏观与微观环境',swot:'SWOT 分析',stp:'市场选择 STP',mix:'现行营销 4P',strategy:'未来营销策略',evidence:'现场影像库',closing:'结论与来源'};
const shortTitles = CHAPTERS.map(c => titleMap[c.id]);
const state = { chapter: CHAPTERS.some((c) => c.id === location.hash.slice(1)) ? location.hash.slice(1) : 'opening', mode: 'explore', family: 'school', stay: 'day', strategy: 'service', selectedPart: 'outdoor', selectedNode: 'water', mediaId: '', mediaOpen: false, environment: 'macro', reduced: matchMedia('(prefers-reduced-motion: reduce)').matches };
const points = TOUCHPOINTS;
const mediaLibrary = new Map(MEDIA_ITEMS.map((item) => [item.id, item]));
const localMedia = new Map();
const objectUrls = [];
const nodeButtons = new Map();
let scene, geography, coverScene, currentMedia, currentElement, viewerElement;
let mediaRequest = 0, pendingMediaId = '', disposed = false, toastTimer, scrollFrame;
let viewerReturnFocus, navigationTarget = null;
let sceneChapter = '', sceneSlot = null, sceneRunning = false, geographyRunning = false;
const journeyChapters = ['stp', 'strategy', 'evidence'];
const desktopStory = matchMedia('(min-width: 1100px)');
const layoutName = () => innerWidth >= 1100 ? 'dock' : innerWidth <= 760 ? 'phone' : 'tablet';
let previousLayout = layoutName();
const clamp = (value) => Math.max(0, Math.min(1, value));

const heading = (id) => {
  const c = CHAPTERS.find((chapter) => chapter.id === id);
  return `<header class="chapter-heading"><span class="chapter-eyebrow">${c.number}<i></i>${c.eyebrow}</span><h2 id="title-${id}">${c.title}</h2><p class="lead">${c.summary}</p></header>`;
};
const stage = (id, caption = '点亮这一章的旅程') => `<div class="stage-slot" data-stage-slot="${id}"><div class="stage-placeholder"><img src="/media/field/${id === 'evidence' ? 'phase2.jpg' : 'entrance.jpg'}" alt="" loading="lazy"><button data-go="${id}">${caption} ↗</button></div></div>`;
const field = (key) => `<span data-field="${key}"></span>`;
const paragraphs = (items) => items.map((p) => `<p>${escape(p)}</p>`).join('');
const sourceLinks = (items = []) => `<div class="case-sources" aria-label="查看本项依据">${items.map((s) => `<a href="${escape(s.url)}" target="_blank" rel="noopener noreferrer" title="${escape(s.note || '在新标签页查看依据')}">${escape(s.title)} <span aria-hidden="true">↗</span><span class="sr-only">（新标签页）</span></a>`).join('')}</div>`;
const caseDetails = (id, items) => `<details class="case-details" data-case="${id}"><summary><span class="when-closed">展开案例与分析</span><span class="when-open">收起详细分析</span><i aria-hidden="true">⌄</i></summary><div class="case-body">${paragraphs(items)}</div></details>`;
const pair = (label, key) => `<div><dt>${label}</dt><dd>${field(key)}</dd></div>`;
const familyControls = `<div class="family-choices" role="group" aria-label="选择家庭结构">${Object.entries(FAMILIES).map(([id, f]) => `<button class="family-choice" data-family="${id}" aria-pressed="${id === state.family}"><small>${f.index.split(' / ')[0]}</small><span><b>${f.name}</b><small>${f.tag}</small></span></button>`).join('')}</div><div class="stay-choices" role="group" aria-label="选择停留时间"><button data-stay="day" aria-pressed="true">一日体验</button><button data-stay="overnight" aria-pressed="false">留宿一晚</button></div>`;
const chapterContent = {
  opening: `<div class="cover-grid"><div class="cover-copy"><span class="cover-kicker"><i></i> 旅游市场营销 · 专题研究</span><p class="cover-location">MACAU / COTAI</p><h1 id="title-opening"><span>新濠影汇</span><em>市场营销分析</em></h1><p class="cover-subtitle"><span></span>以亲子度假市场为重点</p><p class="cover-intro">从一座度假村的资源，<br>看见一个市场的选择。</p><div class="cover-actions"><button class="cover-primary" data-enter="present">课堂汇报 <span>↗</span></button><button class="cover-secondary" data-enter="explore">自由探索 <span>→</span></button></div><div class="cover-note"><span>01—06 / 企业 · 市场 · 策略</span><span>12–15 MIN / 互动研究</span></div></div><div class="cover-art"><div class="cover-orbit orbit-one"></div><div class="cover-orbit orbit-two"></div><span class="cover-art-label">THE GOLDEN THREAD</span><div class="cover-canvas-wrap" id="cover-stage"><canvas id="cover-canvas" tabindex="0" aria-label="金色8字地标装置，可拖拽旋转；方向键旋转，Home复位"></canvas><div class="cover-fallback" id="cover-fallback" hidden><img src="/media/field/entrance.jpg" alt="新濠影汇实拍建筑与8字形地标"></div></div><div class="cover-art-caption"><span><i></i> 8 字地标 · 三维意象</span><button id="reset-cover" aria-label="重置封面地标视角">拖拽探索 / 复位 ↺</button></div><button class="cover-photo" data-media="phase1" aria-label="展开新濠影汇入口实拍"><img src="/media/field/entrance.jpg" alt="新濠影汇入口实拍"><span>FIELD NOTES <b>走进真实现场 ↗</b></span></button></div></div><div class="cover-bottom"><button class="scroll-cue" data-go="enterprise"><i aria-hidden="true">↓</i><span>向下滚动，展开研究</span></button><span>STUDIO CITY / A MARKETING STUDY</span><span>本组实拍 · 官方资料 · 团队分析</span></div>`,
  enterprise: `${heading('enterprise')}<div class="enterprise-intro"><div class="enterprise-copy"><span class="eyebrow">COMPANY / BUSINESS / FOCUS</span>${paragraphs(ENTERPRISE_PARAGRAPHS)}</div><figure class="field-figure"><img src="/media/field/entrance.jpg" alt="本组拍摄的新濠影汇正面入口及8字形影汇之星" loading="lazy"><figcaption>新濠影汇正面入口与影汇之星 · 本组现场记录</figcaption><button class="text-link" data-media="phase1">完整查看 ↗</button></figure></div><div class="fact-strip">${FACTS.map((f) => `<a class="fact-item" href="${f.source}" target="_blank" rel="noopener noreferrer"><b>${f.value}</b><span>${f.label} ↗</span><small>${f.note}</small></a>`).join('')}</div><div id="geography-host"></div><div class="section-note"><span class="eyebrow">OUR RESEARCH QUESTION</span><h3>${RESEARCH_QUESTION}</h3><p>${ENTERPRISE_OVERVIEW}</p></div><details class="analysis-details"><summary>空间依据与模型边界</summary><p>${MODEL_BOUNDARY}</p></details><div class="reading-bridge"><button class="text-link" data-go="environment">从企业资源进入市场分析 →</button><button class="text-link" data-go="closing">查看实拍影像与来源 ↗</button></div>`,
  environment: `${heading('environment')}<div class="market-context"><span class="eyebrow">2025 / MACAU TOURISM</span>${paragraphs(MARKET_CONTEXT.paragraphs)}${sourceLinks(MARKET_CONTEXT.sources)}</div><div class="tabs" role="group" aria-label="环境分析维度"><button data-environment="macro" aria-pressed="true">宏观环境 · PEST</button><button data-environment="micro" aria-pressed="false">微观环境 · 参与者</button></div><div id="environment-content" class="environment-layout"></div><div class="section-note"><span class="eyebrow">COMPETITIVE CONTEXT</span><p>${COMPETITION_NOTE}</p><p>竞争比较采用相同日期、人数和购买条件，分别评价产品权益、总支出与差异价值。</p></div>`,
  swot: `${heading('swot')}<div class="swot-grid">${SWOT.map((s) => `<article class="swot-card"><div class="swot-top"><b>${s.code}</b><span>${s.status}</span></div><h3>${s.title}</h3><p>${s.summary}</p>${caseDetails(`swot-${s.code}`, s.paragraphs)}${sourceLinks(s.sources)}</article>`).join('')}</div><div class="section-note"><span class="eyebrow">FROM ANALYSIS TO ACTION</span><p>${SWOT_BRIDGE}</p></div>`,
  stp: `${heading('stp')}<div class="stp-overview">${paragraphs(STP_OVERVIEW)}</div><div class="stp-criteria">${STP_CRITERIA.map(([label,copy],i)=>`<div><span>0${i+1}</span><h3>${escape(label)}</h3><p>${escape(copy)}</p></div>`).join('')}</div><div class="split interactive-split"><div class="split-copy"><div class="interaction-intro"><span class="eyebrow">EXPLORE / 细分市场比较</span><p>${STP_INTRO}</p></div>${familyControls}<dl class="research-dl">${pair('S / 需求分组', 'need')}${pair('T / 目标选择', 'target')}</dl><div class="position-line"><span class="eyebrow">P / 定位与价值主张</span><p>${field('position')}</p></div><details class="analysis-details"><summary>目标选择依据与适用边界</summary><p>${STP_TARGET}</p><p>${STP_POSITION}</p><p>${field('description')}</p><p>${ANALYSIS_BOUNDARY}</p></details></div>${stage('stp', '比较家庭，重组光路')}</div><p class="fineprint">${ROUTE_BOUNDARY}</p>`,
  mix: `${heading('mix')}<div class="mix-grid">${CURRENT_MIX.map((m,i) => `<article class="mix-card"><div class="mix-index"><span>0${i+1}</span><span>${m.en} / 现行营销分析</span></div><h3>${m.title}</h3><p>${m.summary}</p><b>${m.question}</b>${caseDetails(`mix-${m.key}`, m.paragraphs)}${sourceLinks(m.sources)}</article>`).join('')}</div><div class="case-photo-strip"><button data-media="retail"><img src="/media/field/retail.jpg" alt="实拍商业街内的项目广告与店铺" loading="lazy"><span>现场触点 / 项目信息如何触达游客 ↗</span></button><div><span class="eyebrow">FROM THE FIELD</span><h3>现行营销如何被游客看见？</h3><p>商业街内的游乐广告、价格信息与零售店铺共同构成接触点。照片能够记录信息出现的位置；是否促进购买，仍需用咨询与订单数据检验。</p><button class="text-link" data-go="strategy">把分析转化为未来策略 →</button></div></div>`,
  evidence: `${heading('evidence')}<div class="split evidence-split"><div class="split-copy"><div class="evidence-picker"><label for="point-select">当前建筑 / 业务触点</label><select id="point-select" aria-label="资料对应建筑或业务触点">${Object.entries(PART_SHORT_NAMES).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}</select></div><div class="evidence-analysis"><span class="eyebrow" id="point-subtitle"></span><h3 id="point-title"></h3><div class="evidence-note"><span class="eyebrow">01 / 图中所见</span><p id="observation"></p></div><div class="evidence-note"><span class="eyebrow">02 / 研究意义</span><p id="meaning"></p></div><div class="evidence-note"><span class="eyebrow">03 / 还缺什么</span><p id="missing"></p></div><p class="fineprint">本组实拍记录可见场景；价格、年龄限制与购买权益以所附官方依据为准。试放文件仅在当前浏览器会话中使用。</p></div></div>${stage('evidence', '展开影像与证据')}</div>`,
  strategy: `${heading('strategy')}<p class="proposal-label"><span>TEAM PROPOSAL</span><b>由前述分析推导的改进建议 · 非企业已实施方案</b></p><div class="strategy-options" role="group" aria-label="选择营销策略">${Object.entries(STRATEGIES).map(([id, s]) => `<button class="strategy-choice" data-strategy="${id}" aria-pressed="${id === 'journey'}"><span>${s.letter}</span><div><b>${s.name}</b><small>${s.summary}</small></div></button>`).join('')}</div><div id="strategy-plan" class="strategy-plan" aria-live="polite"></div><details class="strategy-demo"><summary><span>用一个家庭情境演示策略</span><span aria-hidden="true">⌄</span></summary><div class="split interactive-split"><div class="split-copy"><div class="local-context"><label>家庭<select id="family-select" aria-label="策略演示家庭"><option value="young">幼儿家庭</option><option value="school" selected>学龄家庭</option><option value="multi">跨代同行</option></select></label><label>停留<select id="stay-select" aria-label="策略演示停留"><option value="day">一日体验</option><option value="overnight">留宿一晚</option></select></label></div><span class="eyebrow">${field('context')}</span><h3>${field('strategyProduct')}</h3><ol class="action-list" id="action-list"></ol><p class="fineprint">光路展示当前建议的组合关系与信息重点。它不代表实际步行路线或企业现售套餐。</p></div>${stage('strategy', '比较策略的呈现重点')}</div></details>`,
  closing: `${heading('closing')}<p class="closing-quote">让企业资源，成为市场价值。<br><span class="gold-text">让营销建议，有据可循。</span></p><div class="closing-points">${CONCLUSION_POINTS.map((p, i) => `<article class="closing-point"><span>0${i + 1}</span><h3>${['从产品到组合', '从家庭到需求', '从建议到验证'][i]}</h3><p>${p}</p></article>`).join('')}</div><div class="pending-tasks"><span>下一步补齐</span>${PENDING_TASKS.map((t) => `<b>${t}</b>`).join('')}</div><div class="source-section"><span class="eyebrow">FIELD RECORDS & SOURCES</span><h3>每一项分析，都能回到依据。</h3><div class="reference-gallery">${REFERENCE_GALLERY.map((r, i) => `<button class="reference-item" data-reference="${i}"><img src="${r.src}" alt="${r.alt}" loading="lazy"><span>${r.title} ↗</span><small>${r.caption}</small></button>`).join('')}</div><div class="source-links">${SOURCES.map((s) => `<a href="${s.url}" target="_blank" rel="noopener" title="${s.note}">${s.title}<span>↗</span></a>`).join('')}</div><details class="analysis-details"><summary>完整研究边界、模型说明与素材身份</summary><p>${ANALYSIS_BOUNDARY}</p><p>${MODEL_BOUNDARY}</p><p>${ROUTE_BOUNDARY}</p><p>产品与活动资料核对截至 2026 年 10 月 26 日；标价和活动安排是分析时点的案例，不代表实时库存或后续日期报价。实拍照片记录可见场景，不单独证明客流、营业表现或消费转化。</p><a class="text-link" href="/REFERENCE.md" target="_blank">完整模型来源说明 ↗</a></details><div class="copyright-block"><span class="eyebrow">CREDITS & RIGHTS</span><h3>素材来源与使用说明</h3>${paragraphs(COPYRIGHT_PARAGRAPHS)}${sourceLinks([{title:"完整素材清单",url:"/media/CREDITS.md"},{title:"现场文件对应表",url:"/media/field/MANIFEST.json"},{title:"Three.js · MIT 许可",url:"/licenses/THREE-LICENSE.txt"},{title:"Manrope · OFL 许可",url:"/fonts/OFL.txt"},{title:"OpenStreetMap 署名",url:"https://www.openstreetmap.org/copyright"}])}</div><div class="reading-bridge"><button class="primary-link" data-go="opening">回到研究开场 <span>↺</span></button><button class="text-link" data-go="stp">重新比较家庭组合 →</button></div></div>`,
};

$('report').innerHTML = CHAPTERS.map((c) => `<section class="chapter${c.id === state.chapter ? ' active' : ''}" id="${c.id}" data-chapter="${c.id}" aria-labelledby="title-${c.id}">${chapterContent[c.id]}</section>`).join('');
const nav = CHAPTERS.map((c, i) => `<button data-go="${c.id}"><small>${c.number}</small>${shortTitles[i]}</button>`).join('');
$('chapter-rail').innerHTML = nav + '<p class="rail-note">A PLACE.<br>A MARKET.<br>A STRATEGY.<br><br>主线约 13 分钟</p>';
$('menu-chapters').innerHTML = nav;
$('experience-parking').append($('experience'));
const footerTools = document.querySelector('.footer-tools');
$('relation-legend').innerHTML = Object.entries(RELATION_TYPES).map(([type, relation]) => `<span data-relation="${type}" style="--relation-color:${relation.color}"><i aria-hidden="true"></i>${relation.label}</span>`).join('');
$('evidence-nodes').innerHTML = JOURNEY_NODE_IDS.map(id => `<button data-node="${id}">${points[id].name}</button>`).join('');

function toast(message) {
  $('toast').textContent = message; $('toast').classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3800);
}
function renderEnvironment() {
  const env = ENVIRONMENTS[state.environment];
  $('environment-content').innerHTML = `<div class="environment-intro"><span class="eyebrow">${env.kicker}</span><h3>${env.heading}</h3><p>${env.summary}</p>${sourceLinks(env.sources || [])}</div><div class="environment-items">${env.items.map(([code, title, copy]) => `<article class="environment-item"><span>${code}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div>`;
  document.querySelectorAll('[data-environment]').forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.environment === state.environment)));
  scheduleViewport();
}
function renderStrategy() {
  const plan = STRATEGY_PLANS[state.strategy];
  $('strategy-plan').innerHTML = `<div class="strategy-purpose"><span class="eyebrow">${escape(plan.priority)}</span><h3>${escape(plan.title)}</h3><p>${escape(plan.goal)}</p><div class="strategy-basis"><b>分析依据</b><p>${escape(plan.basis)}</p></div></div><div class="strategy-delivery"><ol class="action-list">${plan.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><details class="analysis-details"><summary>执行主体、资源与衡量指标</summary><p><b>建议执行主体：</b>${escape(plan.owner)}</p><p><b>所需资源：</b>${escape(plan.resources)}</p><ul>${plan.metrics.map(m=>`<li>${escape(m)}</li>`).join('')}</ul><p class="fineprint">以上为试点建议；指标用于后续衡量，不代表已有成效。</p></details></div>`;
}
function renderResearch() {
  const research = deriveResearch(state);
  document.documentElement.style.setProperty('--accent', FAMILIES[state.family].color);
  for (const key of ['family', 'stay', 'strategy']) {
    if ($(`${key}-select`)) $(`${key}-select`).value = state[key];
    document.querySelectorAll(`[data-${key}]`).forEach((el) => { if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(el.dataset[key] === state[key])); });
  }
  document.querySelectorAll('[data-field]').forEach((el) => { el.textContent = research[el.dataset.field] || ''; });
  $('action-list').innerHTML = research.actions.map((a) => `<li>${escape(a)}</li>`).join('');
  renderStrategy();
  $('experience-context').textContent = research.context;
  $('route-label').textContent = state.strategy === 'journey' ? '体验组合 · 团队建议' : '信息呈现顺序 · 团队建议';
  $('route-count').textContent = `${research.routeNodes.length} 个体验触点`;
  $('route-note').textContent = '点击触点聚焦相关联系；切换家庭与停留时间，比较体验组合。';
  $('route-chips').innerHTML = research.routeNodes.map((id, i) => `${i ? '<span class="route-arrow" aria-hidden="true">→</span>' : ''}<button class="route-chip" data-node="${id}" aria-pressed="${state.selectedNode === id}"><small>0${i + 1}</small>${points[id].name}</button>`).join('');
  nodeButtons.forEach((button, id) => { button.dataset.active = String(research.routeNodes.includes(id)); button.setAttribute('aria-pressed', String(id === state.selectedNode)); button.setAttribute('aria-label', `${sceneChapter === 'evidence' ? '查看影像：' : '聚焦联系：'}${points[id].name}`); });
  $('evidence-nodes').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.node === state.selectedNode)));
  const relations = research.routeNodes.slice(1).map((to, i) => ({ from: research.routeNodes[i], to, type: classifyRelation(research.routeNodes[i], to) }));
  const selectedRelations = relations.filter(r => r.from === state.selectedNode || r.to === state.selectedNode);
  $('relation-status').textContent = selectedRelations.length ? selectedRelations.map(r => `${points[r.from].name} ↔ ${points[r.to].name} · ${RELATION_TYPES[r.type].label}`).join('；') : `${points[state.selectedNode].name} · 未包含在当前情境组合中`;
  $('relation-legend').querySelectorAll('[data-relation]').forEach(el => el.dataset.used = String(relations.some(r => r.type === el.dataset.relation)));
  Object.assign($('report').dataset, { family: state.family, stay: state.stay, strategy: state.strategy, route: research.routeLegacy.join(','), selectedPart: state.selectedPart, selectedNode: state.selectedNode });
  Object.assign($('effect-stage').dataset, { family: state.family, stay: state.stay, strategy: state.strategy, route: research.routeNodes.join(','), selected: state.selectedNode });
  scene?.setState({ family: state.family, stay: state.stay, route: research.routeNodes, accent: FAMILIES[state.family].color });
  scene?.setSelected(state.selectedNode);
  geography?.update({ selectedPart: state.selectedPart, routeLegacy: research.routeLegacy, highlight: research.highlight });
}
function choose(key, value) {
  if (key === 'family' && !FAMILIES[value] || key === 'strategy' && !STRATEGIES[value] || key === 'stay' && !['day', 'overnight'].includes(value)) return;
  state[key] = value; renderResearch(); scheduleViewport();
}

JOURNEY_NODE_IDS.forEach((id) => {
  const button = document.createElement('button'); button.className = 'effect-label'; button.dataset.node = id;
  button.setAttribute('aria-label', `查看${points[id].name}影像`); button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<i aria-hidden="true"></i><span>${points[id].name}</span>`;
  $('effect-labels').append(button); nodeButtons.set(id, button);
});
try {
  coverScene = createCoverScene({ canvas: $('cover-canvas'),
    onReady() { $('cover-stage').dataset.ready = 'true'; $('cover-fallback').hidden = true; },
    onError() { $('cover-fallback').hidden = false; $('cover-stage').dataset.ready = 'false'; }
  });
  coverScene.setReducedMotion(state.reduced);
} catch { $('cover-fallback').hidden = false; }
try {
  scene = createJourneyScene({
    canvas: $('effect-canvas'), onNodeSelect: selectNode,
    onRelationHover(relation) {
      const tooltip = $('relation-tooltip'); tooltip.hidden = !relation;
      if (relation) { tooltip.textContent = `${points[relation.from].name} ↔ ${points[relation.to].name} · ${relation.label}`; tooltip.style.setProperty('--relation-color', RELATION_TYPES[relation.type].color); }
    },
    onReady() { $('effect-loading').classList.add('done'); $('effect-loading').setAttribute('aria-hidden', 'true'); $('effect-error').hidden = true; $('effect-stage').dataset.ready = 'true'; },
    onError() { $('effect-loading').classList.add('done'); $('effect-error').hidden = false; $('effect-stage').dataset.ready = 'false'; },
    onProject(projected) { for (const point of projected) { const button = nodeButtons.get(point.id); if (!button) continue; button.style.transform = `translate(${point.x}px,${point.y}px) translate(-50%,-50%)`; button.hidden = !point.visible; } },
  });
  scene.setActive(false); scene.setReducedMotion(state.reduced);
} catch { $('effect-loading').classList.add('done'); $('effect-error').hidden = false; $('effect-stage').dataset.ready = 'false'; }

function displayScene(slot, id, progress) {
  if (!slot) {
    if (sceneRunning) { scene?.setActive(false); sceneRunning = false; }
    pauseVideo();
    return;
  }
  if (sceneSlot !== slot) {
    scene?.setActive(false); sceneRunning = false;
    sceneSlot?.classList.remove('has-stage'); slot.append($('experience')); slot.classList.add('has-stage'); sceneSlot = slot;
    if (!state.reduced) $('experience').animate([{opacity:.25,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}], {duration:520,easing:'cubic-bezier(.22,.68,0,1)'});
  }
  if (sceneChapter !== id) {
    sceneChapter = id;
    const evidence = id === 'evidence';
    $('route-panel').hidden = evidence; $('media-panel').hidden = !evidence;
    $('experience').classList.toggle('is-evidence', evidence); $('effect-labels').hidden = false;
    $('effect-hint').textContent = evidence ? '点击触点，在上方展开影像 · 拖拽旋转' : '点击触点聚焦联系 · 拖拽旋转';
    scene?.setPhase('route'); scene?.setMedia(null); $('relation-tooltip').hidden = true;
    if (evidence) renderEvidence();
    else if (navigationTarget?.id === 'evidence' && state.mediaOpen) { $('evidence-preview').hidden = true; $('experience').classList.remove('has-media-preview'); pauseVideo(); }
    else closePreview(false);
    renderResearch();
  }
  scene?.setScrollProgress?.({ progress, section: id });
  $('effect-stage').dataset.scrollProgress = progress.toFixed(4);
  $('effect-stage').dataset.section = id;
  $('report').dataset.sceneChapter = id;
  const canvasVisible = visiblePixels($('effect-canvas').getBoundingClientRect(), viewportInset()) > 20;
  if (canvasVisible !== sceneRunning) {
    scene?.setActive(canvasVisible); sceneRunning = canvasVisible;
  }
  if (!state.mediaOpen || visiblePixels($('evidence-preview').getBoundingClientRect(), viewportInset()) < 20) pauseVideo();
}
function viewportInset() { return document.querySelector('.context-bar').getBoundingClientRect().bottom + 20; }
function visiblePixels(rect, inset) { return Math.max(0, Math.min(rect.bottom, innerHeight - (state.mode === 'present' ? 76 : 25)) - Math.max(rect.top, inset)); }
function scheduleViewport() { if (!scrollFrame && !disposed) scrollFrame = requestAnimationFrame(syncViewport); }
function syncViewport() {
  scrollFrame = 0;
  if (disposed) return;
  if (document.querySelector('dialog[open]')) {
    coverScene?.setActive(false); scene?.setActive(false); geography?.setActive(false);
    sceneRunning = geographyRunning = false;
    return;
  }
  const inset = viewportInset(), line = Math.max(inset + 55, innerHeight * .34);
  const rects = new Map(CHAPTERS.map((c) => [c.id, $(c.id).getBoundingClientRect()]));
  let reading = 'opening';
  for (const c of CHAPTERS) {
    const rect = rects.get(c.id);
    if (rect.top <= line) reading = c.id;
    $(c.id).style.setProperty('--chapter-progress', clamp((line - rect.top) / Math.max(1, rect.height)).toFixed(4));
  }
  if (navigationTarget) {
    const destination = navigationTarget.id === 'opening' ? 0 : Math.max(0, scrollY + rects.get(navigationTarget.id).top - inset);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    if (Math.abs(scrollY - Math.min(destination, maxScroll)) < 3 || performance.now() - navigationTarget.started > 3500) navigationTarget = null;
  }
  if (!navigationTarget && reading !== state.chapter) setChapter(reading, { scroll: false });
  const pageProgress = clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
  document.documentElement.style.setProperty('--reading-progress', pageProgress.toFixed(5));
  $('reading-percent').textContent = `${Math.round(pageProgress * 100)}%`;
  document.body.classList.toggle('scrolled', scrollY > 50);
  $('report').dataset.readingProgress = pageProgress.toFixed(5);

  const coverRect = rects.get('opening');
  const coverProgress = clamp(-coverRect.top / Math.max(1, coverRect.height * .85));
  $('opening').style.setProperty('--cover-progress', coverProgress.toFixed(4));
  coverScene?.setProgress(coverProgress);
  const coverCanvasRect = $('cover-canvas').getBoundingClientRect();
  coverScene?.setActive(!document.hidden && visiblePixels(coverCanvasRect, 72) > 25);
  document.body.classList.toggle('on-cover', coverRect.bottom > innerHeight * .35);

  const candidates = [];
  for (const id of journeyChapters) {
    const slot = document.querySelector(`[data-stage-slot="${id}"]`), rect = slot.getBoundingClientRect();
    if (!rect.width || !rect.height || slot.closest('details:not([open])')) continue;
    candidates.push({ slot, id, rect, score: visiblePixels(rect, inset), progress: clamp((line - rects.get(id).top) / Math.max(300, rects.get(id).height - innerHeight * .25)) });
  }
  candidates.sort((a, b) => b.score - a.score);
  const candidate = candidates[0];
  if (candidate?.score > 35) displayScene(candidate.slot, candidate.id, candidate.progress);
  else displayScene(null);
  const geoRect = $('geography-host').querySelector('[data-geo="stage"]')?.getBoundingClientRect();
  const geoVisible = !!geoRect && visiblePixels(geoRect, inset) > 30;
  if (geoVisible !== geographyRunning) { geography?.setActive(geoVisible); geographyRunning = geoVisible; }
  if (navigationTarget) scheduleViewport();
}
function setChapter(id, { scroll = true, instant = false } = {}) {
  if (!CHAPTERS.some((c) => c.id === id)) return;
  state.chapter = id;
  const index = CHAPTERS.findIndex((c) => c.id === id);
  document.querySelectorAll('[data-chapter]').forEach((el) => el.classList.toggle('active', el.dataset.chapter === id));
  document.querySelectorAll('[data-go]').forEach((el) => { if (el.dataset.go === id) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current'); });
  $('report').dataset.chapter = id; $('report').dataset.mode = state.mode;
  $('chapter-progress').textContent = `${String(index + 1).padStart(2, '0')} / 09`;
  $('chapter-duration').textContent = `建议讲解 ${CHAPTERS[index].duration}`;
  $('footer-chapter').textContent = shortTitles[index];
  $('context-chapter').textContent = `${CHAPTERS[index].number} / ${shortTitles[index]}`;
  $('context-next').disabled = index === CHAPTERS.length - 1;
  $('reading-label').textContent = `${CHAPTERS[index].number} / ${shortTitles[index]}`;
  $('prev-chapter').disabled = index === 0; $('next-chapter').disabled = index === CHAPTERS.length - 1;
  history.replaceState(null, '', `#${id}`);
  if (scroll) {
    navigationTarget = { id, started: performance.now() };
    const top = id === 'opening' ? 0 : Math.max(0, scrollY + $(id).getBoundingClientRect().top - viewportInset());
    window.scrollTo({ top, behavior: state.reduced || instant ? 'instant' : 'smooth' });
  }
  scheduleViewport();
}
function setMode(mode) {
  if (!['present', 'explore'].includes(mode) || state.mode === mode) return;
  state.mode = mode; document.body.dataset.mode = mode;
  document.querySelectorAll('button[data-mode]').forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.mode === mode)));
  if (mode === 'present') document.querySelector('.presentation-nav').before(footerTools);
  else $('reading-status').append(footerTools);
  $('report').dataset.mode = mode;
  scheduleViewport();
  toast(mode === 'present' ? '课堂导览已开启 · 可滚动阅读，也可按章推进' : '自由探索 · 连续滚动阅读，所有选择继续保留');
}
function selectPart(id, open = false) {
  if (!PART_TO_NODE[id]) return;
  if (id !== state.selectedPart) state.mediaId = points[PART_TO_NODE[id]].mediaIds[0] || '';
  state.selectedPart = id; state.selectedNode = PART_TO_NODE[id];
  if (id === 'northTower' || id === 'southTower') state.mediaId = 'phase2';
  else if (id === 'phase1') state.mediaId = 'phase1';
  renderResearch();
  if (open) { if (state.chapter !== 'evidence' || sceneChapter !== 'evidence') setChapter('evidence'); openPreview(); }
}
function selectNode(id) {
  if (!points[id]) return;
  const part = PART_TO_NODE[state.selectedPart] === id ? state.selectedPart : NODE_TO_PART[id];
  selectPart(part, false);
  if (sceneChapter === 'evidence') openPreview();
}

function placeCurrentMedia() {
  if (!currentElement || viewerElement === currentElement) return;
  const show = state.mediaOpen && sceneChapter === 'evidence' && currentMedia?.id === state.mediaId && !pendingMediaId;
  (show ? $('preview-surface') : $('media-parking')).append(currentElement);
}
function openPreview() {
  state.mediaOpen = true; renderEvidence(); scheduleViewport();
  // Reveal the photograph itself when a low node or thumbnail opened it.
  requestAnimationFrame(() => {
    if (!state.mediaOpen || sceneChapter !== 'evidence' || navigationTarget) return;
    const rect = $('evidence-preview').getBoundingClientRect(), inset = viewportInset();
    if (rect.top < inset || rect.bottom > innerHeight - 76) window.scrollTo({top: Math.max(0, scrollY + rect.top - inset), behavior: state.reduced ? 'instant' : 'smooth'});
  });
}
function closePreview(restoreFocus = true) {
  state.mediaOpen = false; mediaRequest++; pendingMediaId = ''; pauseVideo();
  $('evidence-preview').hidden = true; $('experience').classList.remove('has-media-preview');
  $('full-view').disabled = true; $('video-toggle').disabled = true; $('effect-stage').dataset.mediaStatus = 'closed';
  placeCurrentMedia();
  if (restoreFocus) (nodeButtons.get(state.selectedNode) || $('point-select')).focus({preventScroll:true});
  scheduleViewport();
}

function updateMediaLabels(item) {
  $('media-kind').textContent = item.kind; $('media-title').textContent = item.title; $('media-credit').textContent = item.credit;
  $('selected-media-caption').textContent = item.caption || item.credit;
  $('video-toggle').hidden = item.type !== 'video'; updateVideoButton();
}
function renderEvidence() {
  const point = points[state.selectedNode];
  $('point-select').value = state.selectedPart;
  $('point-title').textContent = PART_SHORT_NAMES[state.selectedPart]; $('point-subtitle').textContent = point.subtitle;
  $('observation').textContent = point.observation; $('meaning').textContent = point.meaning; $('missing').textContent = point.missing;
  const items = [...point.mediaIds, ...(localMedia.get(state.selectedPart) || [])].map((id) => mediaLibrary.get(id)).filter(Boolean);
  if (!items.some((item) => item.id === state.mediaId)) state.mediaId = items[0]?.id || '';
  const focused = document.activeElement?.dataset.mediaId;
  $('media-thumbs').innerHTML = items.map((item) => `<button class="media-thumb" data-media-id="${item.id}" aria-pressed="${item.id === state.mediaId}" aria-label="${item.type === 'video' ? '视频' : '图片'}：${escape(item.title)}">${item.poster ? `<img src="${escape(item.poster)}" alt="" loading="lazy">` : ''}<small>${item.type === 'video' ? '▶ VIDEO' : 'PHOTO'}</small></button>`).join('');
  if (focused) $('media-thumbs').querySelector(`[data-media-id="${focused}"]`)?.focus({ preventScroll: true });
  const item = mediaLibrary.get(state.mediaId);
  $('evidence-preview').hidden = !state.mediaOpen || sceneChapter !== 'evidence';
  $('experience').classList.toggle('has-media-preview', state.mediaOpen && sceneChapter === 'evidence');
  if (item) $('selected-media-caption').textContent = item.caption || item.credit;
  if (!state.mediaOpen || sceneChapter !== 'evidence') return;
  if (item && currentMedia?.id !== item.id) { if (pendingMediaId !== item.id) void loadMedia(item); }
  else if (item) { if (pendingMediaId) { mediaRequest++; pendingMediaId = ''; } placeCurrentMedia(); $('preview-status').textContent = ''; $('preview-surface').setAttribute('aria-busy', 'false'); $('full-view').disabled = false; $('effect-stage').dataset.mediaStatus = 'ready'; updateMediaLabels(item); }
}
function releaseElement(element) {
  if (!element) return;
  if (element instanceof HTMLVideoElement) { element.pause(); element.removeAttribute('src'); element.load(); }
  element.remove();
}
async function loadMedia(item) {
  const request = ++mediaRequest; pendingMediaId = item.id; pauseVideo();
  placeCurrentMedia(); $('preview-status').textContent = '正在载入影像…'; $('preview-surface').setAttribute('aria-busy', 'true');
  updateMediaLabels(item); $('full-view').disabled = true; $('video-toggle').disabled = true;
  $('media-title').textContent = '正在载入影像…'; $('effect-stage').dataset.mediaStatus = 'loading';
  const element = document.createElement(item.type === 'video' ? 'video' : 'img');
  element.setAttribute('aria-label', item.alt);
  if (item.type === 'image') element.alt = item.alt;
  else { element.preload = 'auto'; element.playsInline = true; element.loop = true; element.muted = true; element.poster = item.poster || ''; }
  try {
    await new Promise((resolve, reject) => {
      const ready = item.type === 'video' ? 'loadeddata' : 'load';
      const cleanup = () => { clearTimeout(timer); element.removeEventListener(ready, success); element.removeEventListener('error', fail); };
      const success = () => { cleanup(); resolve(); }; const fail = () => { cleanup(); reject(new Error('media-error')); };
      const timer = setTimeout(() => { cleanup(); reject(new Error('media-timeout')); }, 15000);
      element.addEventListener(ready, success, { once: true }); element.addEventListener('error', fail, { once: true });
      element.src = item.src; if (item.type === 'video') element.load();
    });
    if (request !== mediaRequest || state.mediaId !== item.id || !state.mediaOpen || disposed) { releaseElement(element); return; }
    pendingMediaId = ''; const previous = currentElement; currentMedia = item; currentElement = element;
    scene?.setMedia(null); releaseElement(previous); placeCurrentMedia();
    $('preview-status').textContent = ''; $('preview-surface').setAttribute('aria-busy', 'false');
    if (item.type === 'video') { element.addEventListener('play', updateVideoButton); element.addEventListener('pause', updateVideoButton); }
    updateMediaLabels(item); $('full-view').disabled = false;
    Object.assign($('effect-stage').dataset, { media: item.id, mediaType: item.type, mediaStatus: 'ready' });
  } catch {
    releaseElement(element); if (request !== mediaRequest || state.mediaId !== item.id || !state.mediaOpen || disposed) return;
    pendingMediaId = ''; scene?.setMedia(null); releaseElement(currentElement); currentElement = null; currentMedia = null;
    $('media-title').textContent = '影像暂时无法载入'; $('media-credit').textContent = '请选择其他素材，或换用 JPG、PNG、WebP、H.264 MP4 文件。';
    $('preview-status').textContent = '未能载入，请选择其他素材'; $('preview-surface').setAttribute('aria-busy', 'false');
    $('effect-stage').dataset.mediaStatus = 'error'; toast('未能读取该文件，请换一份素材');
  }
}
function pauseVideo() { if (currentElement instanceof HTMLVideoElement) currentElement.pause(); }
function updateVideoButton() {
  const video = currentElement instanceof HTMLVideoElement;
  $('video-toggle').textContent = video && !currentElement.paused ? '暂停短片' : '播放短片';
  $('video-toggle').disabled = !video || !!pendingMediaId || !state.mediaOpen;
}
async function toggleVideo() {
  if (!(currentElement instanceof HTMLVideoElement) || pendingMediaId || !state.mediaOpen) return;
  const video = currentElement, request = mediaRequest;
  if (!currentElement.paused) currentElement.pause();
  else try { await video.play(); } catch (error) { if (error.name !== 'AbortError' && video === currentElement && request === mediaRequest && state.mediaOpen && !disposed) toast('视频未能播放，请展开查看或换一个文件'); }
  updateVideoButton();
}
function modalLock() { document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]')); scheduleViewport(); }
function showViewer(element, item) {
  viewerReturnFocus = document.activeElement; viewerElement = element;
  $('viewer-title').textContent = item.title; $('viewer-kind').textContent = item.kind; $('viewer-credit').textContent = [item.credit, item.caption].filter(Boolean).join(' · ');
  $('viewer-source').hidden = !item.sourceUrl; if (item.sourceUrl) $('viewer-source').href = item.sourceUrl;
  $('viewer-surface').append(element); if (element instanceof HTMLVideoElement) element.controls = true;
  $('media-viewer').showModal(); modalLock(); $('close-viewer').focus();
}
$('media-viewer').addEventListener('close', () => {
  if (viewerElement === currentElement) { pauseVideo(); if (currentElement instanceof HTMLVideoElement) currentElement.controls = false; viewerElement = null; placeCurrentMedia(); }
  else releaseElement(viewerElement);
  viewerElement = null; modalLock(); if (viewerReturnFocus?.isConnected) viewerReturnFocus.focus({ preventScroll: true });
});
for (const id of ['menu-dialog', 'help-dialog']) $(id).addEventListener('close', modalLock);

document.addEventListener('click', (event) => {
  const button = event.target.closest('button'); if (!button || button.disabled) return;
  const d = button.dataset;
  if (d.enter) { setMode(d.enter); setChapter('enterprise'); }
  else if (d.go) { if ($('menu-dialog').open) $('menu-dialog').close(); setChapter(d.go); }
  else if (d.mode) setMode(d.mode);
  else if (d.family) choose('family', d.family);
  else if (d.stay) choose('stay', d.stay);
  else if (d.strategy) choose('strategy', d.strategy);
  else if (d.node) selectNode(d.node);
  else if (d.media) {
    const item = mediaLibrary.get(d.media); if (!item) return;
    const image = new Image(); image.src = item.src; image.alt = item.alt; showViewer(image, item);
  }
  else if (d.mediaId) { state.mediaId = d.mediaId; openPreview(); }
  else if (d.environment) { state.environment = d.environment; renderEnvironment(); }
  else if (d.close) $(d.close).close();
  else if (d.reference !== undefined) {
    const ref = REFERENCE_GALLERY[Number(d.reference)]; const image = new Image(); image.src = ref.src; image.alt = ref.alt;
    showViewer(image, { title: ref.title, kind: '本组现场照片', credit: ref.caption, sourceUrl: ref.source });
  }
});
for (const key of ['family', 'stay', 'strategy']) $(`${key}-select`)?.addEventListener('change', (event) => choose(key, event.target.value));
$('point-select').addEventListener('change', (event) => selectPart(event.target.value, true));
$('prev-chapter').addEventListener('click', () => stepChapter(-1)); $('next-chapter').addEventListener('click', () => stepChapter(1));
$('context-next').addEventListener('click', () => stepChapter(1));
$('reset-cover').addEventListener('click', () => coverScene?.resetView());
$('reset-effect').addEventListener('click', () => { scene?.resetView(); toast('装置视角已复位'); });
$('full-view').addEventListener('click', () => { if (currentElement) showViewer(currentElement, currentMedia); });
$('close-viewer').addEventListener('click', () => $('media-viewer').close());
$('close-preview').addEventListener('click', () => closePreview());
$('video-toggle').addEventListener('click', toggleVideo);
$('open-menu').addEventListener('click', () => { $('menu-dialog').showModal(); modalLock(); });
$('help-button').addEventListener('click', () => { $('help-dialog').showModal(); modalLock(); });
function applyMotion() {
  scene?.setReducedMotion(state.reduced); geography?.setReducedMotion(state.reduced); coverScene?.setReducedMotion(state.reduced);
  document.body.classList.toggle('reduced-motion', state.reduced);
  $('motion-toggle').setAttribute('aria-pressed', String(state.reduced)); $('motion-toggle').textContent = state.reduced ? '静谧模式' : '动效开启';
  if (state.reduced) pauseVideo();
  scheduleViewport();
}
$('motion-toggle').addEventListener('click', () => { state.reduced = !state.reduced; applyMotion(); });
$('import-media').addEventListener('click', () => $('media-input').click());
$('media-input').addEventListener('change', (event) => {
  const added = [];
  Array.from(event.target.files || []).forEach((file) => {
    if (!/^image\/(jpeg|png|webp)$|^video\/(mp4|webm)$/.test(file.type)) return;
    const src = URL.createObjectURL(file); objectUrls.push(src); const id = `local-${Date.now()}-${objectUrls.length}`;
    const type = file.type.startsWith('video') ? 'video' : 'image';
    mediaLibrary.set(id, { id, type, src, poster: type === 'image' ? src : '', title: file.name.replace(/\.[^.]+$/, ''), alt: file.name, kind: '本地试放资料', credit: '仅当前浏览器预览 · 不上传 · 刷新后恢复；分析文字需随正式资料修订' }); added.push(id);
  });
  if (added.length) { localMedia.set(state.selectedPart, [...(localMedia.get(state.selectedPart) || []), ...added]); state.mediaId = added[0]; openPreview(); toast(`已为${PART_SHORT_NAMES[state.selectedPart]}加入 ${added.length} 份临时资料`); }
  else toast('请选择 JPG、PNG、WebP、MP4 或 WebM 文件');
  event.target.value = '';
});
function stepChapter(direction) {
  const index = CHAPTERS.findIndex((c) => c.id === state.chapter);
  setChapter(CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, index + direction))].id);
}
window.addEventListener('keydown', (event) => {
  if (state.mode !== 'present' || document.querySelector('dialog[open]') || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,select,textarea,video,canvas,[contenteditable="true"]')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); stepChapter(event.key === 'ArrowRight' ? 1 : -1); }
});
window.addEventListener('scroll', scheduleViewport, { passive: true });
window.addEventListener('resize', () => {
  navigationTarget = null;
  const layout = layoutName();
  if (layout !== previousLayout) { previousLayout = layout; setChapter(state.chapter, { instant: true }); }
  else scheduleViewport();
}, { passive: true });
// Native scrolling stays in charge; direct user input can interrupt an anchor journey.
for (const type of ['wheel', 'touchstart', 'pointerdown']) window.addEventListener(type, () => { navigationTarget = null; }, { passive: true });
desktopStory.addEventListener('change', scheduleViewport);
document.addEventListener('toggle', scheduleViewport, true);
window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (CHAPTERS.some((c) => c.id === id)) setChapter(id); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseVideo(); coverScene?.setActive(false); scene?.setActive(false); geography?.setActive(false); sceneRunning = geographyRunning = false; } else scheduleViewport(); });
const statsInterval = setInterval(() => { if (!document.hidden && !disposed && scene) $('effect-stage').dataset.scene = JSON.stringify(scene.getStats()); }, 1000);
geography = createGeography({ host: $('geography-host'), onPartSelect: (id) => selectPart(id, false), onMedia: (id) => selectPart(id, true) });
geography.setActive(false);
renderEnvironment(); renderResearch(); renderEvidence(); applyMotion();
$('reading-status').append(footerTools);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
}, {rootMargin:'0px 0px -25px 0px',threshold:.05});
document.querySelectorAll('.chapter-heading,.swot-card,.mix-card,.fact-strip,.case-photo-strip').forEach(el=>{el.classList.add('reveal-ready');revealObserver.observe(el);});
const reportResize = new ResizeObserver(scheduleViewport);
reportResize.observe($('report')); reportResize.observe(document.querySelector('.context-bar'));
setChapter(state.chapter, { instant: true });
window.addEventListener('pageshow', scheduleViewport);
window.addEventListener('pagehide', (event) => {
  pauseVideo(); if (event.persisted) return;
  disposed = true; mediaRequest++; clearInterval(statsInterval); clearTimeout(toastTimer); cancelAnimationFrame(scrollFrame);
  reportResize.disconnect(); revealObserver.disconnect(); coverScene?.dispose(); scene?.dispose(); geography?.dispose(); releaseElement(currentElement); objectUrls.forEach((url) => URL.revokeObjectURL(url));
});
