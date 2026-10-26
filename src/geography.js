import './legacy/data.js';
import './legacy/reel-path.js';
import './legacy/geometry.js';
import './legacy/scene.js';
import './geography.css';

/** Retains the calibrated geometry while adapting view controls to the shared report. */
export function createGeography({ host, onPartSelect = () => {}, onMedia = () => {}, onReady = () => {} }) {
  const data = window.SC_DATA;
  const events = new AbortController();
  let scene;
  let active = false;
  let disposed = false;
  let selected = 'phase1';
  let route = [];
  let highlight = [];
  let layout = 'geo';
  let guideIndex = -1;
  let singleLap = false;
  let currentMode = 'webgl';
  let lastSample = null;

  host.innerHTML = `
    <section class="geo-shell" aria-label="新濠影汇地理沙盘">
      <div class="geo-heading"><div><span class="geo-eyebrow">SPATIAL CONTEXT</span><h3>看见空间，理解体验。</h3></div><span class="geo-render-mode" data-geo="mode">正在准备沙盘</span></div>
      <div class="geo-layout" role="group" aria-label="沙盘布局">
        <button type="button" data-layout="geo" aria-pressed="true">地理布局</button><button type="button" data-layout="explode" aria-pressed="false">业务拆解 ↗</button><span data-geo="layout-note">北向与相对位置经地图核对</span>
      </div>
      <div class="geo-stage" data-geo="stage">
        <canvas data-geo="canvas" tabindex="0" aria-label="新濠影汇建筑沙盘。拖动旋转；方向键旋转、加减号缩放、Home复位。普通滚轮浏览页面。"></canvas>
        <canvas data-geo="overlay" aria-hidden="true"></canvas>
        <div class="geo-labels" data-geo="labels" aria-label="沙盘建筑标签"></div>
        <div class="geo-fallback" data-geo="fallback" hidden></div>
        <div class="geo-compass" aria-label="地图北向随视角旋转"><svg viewBox="0 0 70 70" aria-hidden="true"><circle cx="35" cy="35" r="29"/><g data-geo="compass"><path d="M35 12 29 40 35 35 41 40Z"/><path class="south" d="M35 57 29 40 35 35 41 40Z"/></g></svg><b>N</b></div>
        <span class="geo-caption" data-geo="caption">地图校准的建筑示意 · 立面细部与高度经简化</span>
      </div>
      <div class="geo-toolbar" role="group" aria-label="沙盘视图与动画控制">
        <button type="button" data-action="zoom-out" aria-label="缩小地理沙盘">− 缩小</button><button type="button" data-action="zoom-in" aria-label="放大地理沙盘">＋ 放大</button><button type="button" data-action="reset">复位</button><button type="button" data-action="top">北向俯视</button><button type="button" data-action="front">看 8 字轨迹</button><button type="button" data-action="play" aria-pressed="false">舱体演示 ▷</button><button type="button" data-action="guide" aria-pressed="false">沿组合逐站看 →</button>
      </div>
      <p class="geo-attribution">地图轮廓参考 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors ↗</a></p><p class="geo-help">拖动旋转 · 普通滚动浏览页面 · 17 厢保持竖直，沿一条不交叉的 8 字外缘运行。演示速度非实测。</p>
      <details class="geo-detail geo-trajectory">
        <summary>观察橙色 01 厢完整一周</summary>
        <div class="geo-trajectory-controls"><button type="button" data-action="lap">从顶部播放一整圈</button><label>进度 <input data-geo="progress" aria-label="观景厢轨迹进度" type="range" min="0" max="1000" value="0" /></label><output data-geo="progress-value">0.0%</output><label>速度 <select data-geo="speed" aria-label="观景厢演示速度"><option value=".000012">演示</option><option value=".000006">慢放</option></select></label></div>
        <p>顶部 → 一侧上弧 → 同侧腰部 → 下弧 → 底部 → 另一侧腰部 → 顶部。轨迹、座舱与固定构件分别呈现；此处速度仅供观察。</p>
      </details>
      <div class="geo-inspector">
        <div class="geo-part-menu"><span class="geo-eyebrow">选择建筑 / 业务触点</span><div data-geo="part-buttons" role="group" aria-label="选择具体建筑或业务区域"></div></div>
        <div class="geo-part-copy" aria-live="polite"><span class="geo-eyebrow" data-geo="part-kicker"></span><h4 data-geo="part-title"></h4><p data-geo="part-copy"></p><p class="geo-evidence" data-geo="part-evidence"></p><p class="geo-question" data-geo="part-question"></p><div class="geo-part-links"><a data-geo="part-source" target="_blank" rel="noopener">查看依据 ↗</a><button type="button" data-action="media">打开关联资料 ↗</button></div></div>
      </div>
      <p class="geo-route-summary" data-geo="route-summary"></p>
      <details class="geo-detail geo-tools"><summary>地图依据、二维模式与保存画面</summary><p>模型为课堂研究示意，不提供现场导航。地理布局与业务拆解的含义不同；一期与二期、水乐园分区与其他池面分别表示；使用权益以官方条款为准。满纷乐园仅列为业务触点，尚未作地理定位。</p><div class="geo-utility-actions"><a href="/REFERENCE.md" target="_blank">完整模型来源 ↗</a><button type="button" data-action="2d">切换二维示意</button><button type="button" data-action="capture">保存当前沙盘图</button><button type="button" data-action="benchmark">采样 5 秒运行节奏</button></div><output class="geo-metrics" data-geo="metrics">按需绘制；未显示的沙盘会暂停。</output><img class="geo-export-preview" data-geo="export" alt="当前沙盘实际导出的画面" hidden /><p class="geo-metrics-note">采样只描述本机运行情况，JavaScript 提交耗时不包含 GPU 完成时间，不代表其他设备帧率。</p></details>
    </section>`;

  const get = (name) => host.querySelector(`[data-geo="${name}"]`);
  const action = (name) => host.querySelector(`[data-action="${name}"]`);
  const listen = (node, type, fn) => node.addEventListener(type, fn, { signal: events.signal });
  const partButtons = new Map();

  function syncDataset() {
    const stage = get('stage');
    Object.assign(stage.dataset, {
      selectedPart: selected, route: route.join(','), highlight: highlight.join(','), layout,
      mode: currentMode, playing: String(scene?.playing || false), active: String(active),
      progress: String(scene?.cabinTime || 0), guideIndex: String(guideIndex),
    });
  }

  function syncButtons() {
    const unavailable = currentMode === '2d';
    const motionOff = !!scene?.motionReduced;
    action('front').disabled = unavailable;
    action('play').disabled = unavailable || motionOff;
    action('lap').disabled = unavailable || motionOff;
    action('capture').disabled = unavailable;
    get('progress').disabled = unavailable;
    get('speed').disabled = unavailable;
    action('play').textContent = unavailable ? '二维静态布局' : motionOff ? '静谧模式' : scene?.playing ? '暂停舱体 Ⅱ' : '舱体演示 ▷';
    action('play').setAttribute('aria-pressed', String(!!scene?.playing));
    action('2d').textContent = unavailable ? '切回三维沙盘' : '切换二维示意';
    action('guide').disabled = !route.length;
    action('guide').setAttribute('aria-pressed', String(guideIndex >= 0));
    action('guide').textContent = guideIndex < 0 ? '沿组合逐站看 →' : guideIndex < route.length - 1 ? `下一站 ${guideIndex + 2} / ${route.length} →` : '结束逐站导览';
    host.querySelectorAll('[data-layout]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.layout === layout)));
    syncDataset();
  }

  function updateCaption() {
    get('layout-note').textContent = layout === 'geo' ? '北向与相对位置经地图核对' : '分析用分离位置 · 不代表地理距离';
    get('caption').textContent = selected === 'familyPlay' ? '满纷乐园为业务触点，未作地理定位；此组合不绘制地理连线' : currentMode === '2d'
      ? '二维地理示意 · 北朝上 · 非现场导航图'
      : scene?.detailView ? '一期构造特写 · 复位返回地理全景'
        : layout === 'geo' ? '地图校准的建筑示意 · 立面细部与高度经简化' : '业务拆解示意 · 标签与组合关系随各组位置变化';
  }

  function refreshInspector() {
    const part = data.parts[selected];
    if (!part) return;
    get('part-kicker').textContent = part.kicker;
    get('part-title').textContent = part.name;
    get('part-copy').textContent = part.copy;
    get('part-evidence').textContent = part.evidence;
    get('part-question').textContent = part.question;
    get('part-source').href = part.source;
    get('part-source').textContent = `${part.sourceLabel} ↗`;
    partButtons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === selected)));
    const names = route.map((id) => id === 'phase1' ? '住宿讨论点' : data.parts[id]?.short).filter(Boolean);
    get('route-summary').textContent = names.length ? `当前组合展示顺序：${names.join(' → ')}。连线表达研究关系；实际通达、先后与参与条件仍需核实。` : '在页面上方选择家庭与停留时间，查看相应组合。';
    updateCaption(); syncDataset();
  }

  function syncScene() {
    if (!scene || disposed) return;
    scene.setState({ selected, route, highlight });
    refreshInspector(); syncButtons();
  }

  function selectPart(id, fromGuide = false) {
    if (!data.parts[id]) return;
    selected = id;
    if (!fromGuide) guideIndex = -1;
    syncScene();
    onPartSelect(id);
  }

  function resetView() {
    if (!scene) return;
    singleLap = false; guideIndex = -1; layout = 'geo';
    scene.setPlaying(false); scene.setProgress(0); scene.reset();
    // Resetting a camera does not silently overwrite the report's research selection.
    syncScene();
  }

  function setLayout(next) {
    layout = next;
    scene?.setExploded(next === 'explode');
    updateCaption(); syncButtons();
  }

  function onMetrics(result) {
    if (result.status?.startsWith('待机') && lastSample) {
      if (result.totalFrames !== undefined) get('metrics').dataset.totalFrames = String(result.totalFrames);
      syncButtons();
      return;
    }
    if (result.rafMedianMs !== undefined) lastSample = result;
    else if (result.status?.startsWith('采样中')) lastSample = null;
    get('metrics').dataset.status = result.status || '';
    if (result.totalFrames !== undefined) get('metrics').dataset.totalFrames = String(result.totalFrames);
    const sampling = result.status?.startsWith('采样中');
    action('benchmark').disabled = !!sampling;
    get('metrics').textContent = result.rafMedianMs !== undefined
      ? `${result.status} · ${result.frames} 帧 / ${(result.durationMs / 1000).toFixed(2)} 秒；rAF 间隔中位数 ${result.rafMedianMs} ms，P95 ${result.rafP95Ms} ms；GPU 完成时间未测量。`
      : result.status || '按需绘制';
    if (result.rafMedianMs !== undefined) get('metrics').dataset.result = JSON.stringify(result);
    syncButtons();
  }

  Object.entries(data.parts).forEach(([id, part]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.geoPart = id; button.textContent = part.short;
    button.setAttribute('aria-pressed', String(id === selected));
    listen(button, 'click', () => selectPart(id));
    get('part-buttons').append(button); partButtons.set(id, button);
  });

  scene = new window.StudioScene({
    canvas: get('canvas'), overlay: get('overlay'), labels: get('labels'), fallback: get('fallback'), compassNeedle: get('compass'),
    onSelect: selectPart, onReset: resetView, highlightCabin: 0,
    onMode(mode) { currentMode = mode; get('mode').textContent = mode === '2d' ? '二维地理示意' : '三维地理沙盘'; syncButtons(); updateCaption(); },
    onMetrics,
    onProgress(value) {
      let progress = value === 1 ? 1 : ((value % 1) + 1) % 1;
      if (singleLap && value >= 1 && scene) { singleLap = false; scene.cabinTime = 1; scene.setPlaying(false); progress = 1; syncButtons(); }
      get('progress').value = String(Math.round(progress * 1000));
      get('progress-value').textContent = `${(progress * 100).toFixed(1)}%`;
      syncDataset();
    },
  });
  scene.setActive(false);
  host.querySelectorAll('[data-layout]').forEach((button) => listen(button, 'click', () => setLayout(button.dataset.layout)));
  listen(action('zoom-out'), 'click', () => scene.zoom(1));
  listen(action('zoom-in'), 'click', () => scene.zoom(-1));
  listen(action('reset'), 'click', resetView);
  listen(action('top'), 'click', () => { scene.topView(); layout = 'geo'; scene.setExploded(false); updateCaption(); syncButtons(); });
  listen(action('front'), 'click', () => { selectPart('reel'); scene.frontView(); scene.showTrace = true; scene.overlayDirty = true; scene.invalidate(); updateCaption(); });
  listen(action('play'), 'click', () => { singleLap = false; scene.setPlaying(!scene.playing); syncButtons(); });
  listen(action('guide'), 'click', () => {
    if (guideIndex < 0) guideIndex = 0;
    else if (guideIndex < route.length - 1) guideIndex++;
    else guideIndex = -1;
    if (guideIndex >= 0) selectPart(route[guideIndex], true);
    else syncButtons();
  });
  listen(action('lap'), 'click', () => {
    selectPart('reel'); scene.frontView(); scene.showTrace = true;
    scene.setProgress(0); singleLap = true; scene.setPlaying(true); updateCaption(); syncButtons();
  });
  listen(get('progress'), 'input', (event) => {
    singleLap = false; scene.setPlaying(false); scene.setProgress(Number(event.target.value) / 1000); syncButtons();
  });
  listen(get('speed'), 'change', (event) => { scene.speed = Number(event.target.value); });
  listen(action('media'), 'click', () => onMedia(selected));
  listen(action('2d'), 'click', () => {
    singleLap = false;
    if (currentMode === '2d') scene.restoreWebGL();
    else scene.useFallback('手动选择二维示意');
    syncScene();
  });
  listen(action('benchmark'), 'click', () => { if (active) scene.startBenchmark(); });
  listen(action('capture'), 'click', () => {
    const url = scene.capture();
    if (!url) return;
    get('export').src = url; get('export').hidden = false;
    const anchor = document.createElement('a'); anchor.href = url;
    anchor.download = `studio-city-${scene.detailView ? 'reel-detail' : layout === 'geo' ? 'geography' : 'business'}.png`;
    anchor.click();
  });
  listen(get('canvas'), 'keydown', (event) => { if (event.defaultPrevented) event.stopPropagation(); });
  syncScene();
  host.dataset.geoReady = 'true';
  onReady();

  return {
    update(next = {}) {
      if (disposed) return;
      const nextRoute = (next.routeLegacy || route).filter((id) => !!data.parts[id]);
      if (nextRoute.join(',') !== route.join(',')) guideIndex = -1;
      route = [...nextRoute];
      highlight = [...(next.highlight || highlight)].filter((id) => !!data.parts[id]);
      if (data.parts[next.selectedPart]) selected = next.selectedPart;
      if (guideIndex >= 0 && selected !== route[guideIndex]) guideIndex = -1;
      syncScene();
    },
    setActive(value) {
      if (disposed) return;
      active = !!value;
      if (!active) singleLap = false;
      scene.setActive(active);
      syncButtons();
    },
    setReducedMotion(value) { if (!disposed) { scene.setReducedMotion(value); syncButtons(); } },
    dispose() {
      if (disposed) return;
      disposed = true; events.abort(); scene.dispose(); host.replaceChildren();
    },
  };
}
