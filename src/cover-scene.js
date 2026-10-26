import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const TAU = Math.PI * 2;
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;

// A continuous, non-crossing, eight-shaped silhouette. This is an interpretive
// landmark sculpture; the surveyed architectural model remains in the report.
class LandmarkCurve extends THREE.Curve {
  constructor(scale = 1, depth = 0) { super(); this.scale = scale; this.depth = depth; }
  getPoint(t, target = new THREE.Vector3()) {
    const angle = t * TAU;
    return target.set(Math.sin(angle) * (.29 + 1.4 * Math.abs(Math.cos(angle))) * this.scale,
      Math.cos(angle) * 2.66 * this.scale, this.depth);
  }
}

export function createCoverScene({ canvas, onReady, onError } = {}) {
  let renderer;
  const noop = () => {};
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (error) {
    canvas.dataset.ready = 'false'; onError?.(error);
    return { setActive: noop, setProgress: noop, setReducedMotion: noop, resetView: noop, dispose: noop,
      getStats: () => ({ ready: false, error: error.message }) };
  }
  renderer.setClearColor(0x071014, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 80);
  const geometries = new Set(), materials = new Set();
  const geometry = (value) => { geometries.add(value); return value; };
  const material = (value) => { materials.add(value); return value; };
  const addMesh = (geo, mat, parent) => {
    const mesh = new THREE.Mesh(geometry(geo), mat); parent.add(mesh); return mesh;
  };
  const box = (w, h, d, radius, mat, parent) => addMesh(new RoundedBoxGeometry(w, h, d, 2, radius), mat, parent);
  const gold = material(new THREE.MeshPhysicalMaterial({ color: 0xd0b17c, metalness: .97, roughness: .25, clearcoat: .5, envMapIntensity: 1.2 }));
  const champagne = material(new THREE.MeshPhysicalMaterial({ color: 0xe7d2aa, metalness: .94, roughness: .2, clearcoat: .35 }));
  const darkGold = material(new THREE.MeshStandardMaterial({ color: 0x6f5c3a, metalness: .95, roughness: .35 }));
  const graphite = material(new THREE.MeshPhysicalMaterial({ color: 0x142127, metalness: .92, roughness: .23, clearcoat: .7 }));
  const silver = material(new THREE.MeshPhysicalMaterial({ color: 0x87959a, metalness: .95, roughness: .2 }));
  const glass = material(new THREE.MeshPhysicalMaterial({ color: 0x334d59, metalness: .5, roughness: .16, clearcoat: 1, transmission: .12, thickness: .15 }));
  const warm = material(new THREE.MeshBasicMaterial({ color: 0xf8d9a2, toneMapped: false }));
  const cyan = material(new THREE.MeshBasicMaterial({ color: 0x88bbbf, toneMapped: false }));

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, .04);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = .72;
  scene.environmentRotation.set(0, -.35, 0);
  environment.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xc4dce3, 0x211809, 1.7));
  const key = new THREE.RectAreaLight(0xffe5ba, 6, 5, 7);
  key.position.set(-4, 5, 6); key.lookAt(0, 0, 0); scene.add(key);
  const rim = new THREE.RectAreaLight(0xb5e0e6, 5, 2, 6);
  rim.position.set(5, 3, -3); rim.lookAt(0, 0, 0); scene.add(rim);
  const strip = new THREE.RectAreaLight(0xfff2d7, 5, 1, 7);
  strip.position.set(-1, 1, 4); strip.lookAt(0, 0, 0); scene.add(strip);

  const floating = new THREE.Group(); scene.add(floating);
  const sculpture = new THREE.Group(); floating.add(sculpture);
  const architecture = new THREE.Group(); sculpture.add(architecture);
  const track = new THREE.Group(); track.position.y = .3; sculpture.add(track);
  const rails = [];
  for (const [scale, depth, radius, surface] of [[1, .2, .045, champagne], [1, -.2, .045, gold], [.955, .2, .018, darkGold], [.955, -.2, .018, gold]]) {
    const curve = new LandmarkCurve(scale, depth);
    const mesh = addMesh(new THREE.TubeGeometry(curve, 256, radius, 10, true), surface, track);
    rails.push(mesh.geometry);
  }

  // Structural cross-members, carefully spaced so the silhouette remains clear.
  const tieGeo = geometry(new THREE.CylinderGeometry(.012, .012, 1, 5));
  const ties = new THREE.InstancedMesh(tieGeo, gold, 136);
  const matrixObject = new THREE.Object3D();
  const normal = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  const curve = new LandmarkCurve();
  for (let i = 0; i < 136; i++) {
    const point = curve.getPoint(i / 136);
    matrixObject.position.copy(point); matrixObject.rotation.set(Math.PI / 2, 0, 0);
    matrixObject.scale.set(1, .4, 1); matrixObject.updateMatrix(); ties.setMatrixAt(i, matrixObject.matrix);
  }
  track.add(ties);
  const innerCurve = new LandmarkCurve(.955, .19);
  const braces = new THREE.InstancedMesh(tieGeo, darkGold, 72);
  for (let i = 0; i < 72; i++) {
    const a = curve.getPoint(i / 72); a.z = .2;
    const b = innerCurve.getPoint((i + .5) / 72);
    normal.subVectors(b, a); matrixObject.position.copy(a).lerp(b, .5);
    matrixObject.quaternion.setFromUnitVectors(up, normal.clone().normalize());
    matrixObject.scale.set(.7, normal.length(), .7); matrixObject.updateMatrix(); braces.setMatrixAt(i, matrixObject.matrix);
  }
  track.add(braces);

  // Seventeen upright miniature cabins recall the landmark without presenting
  // an engineering simulation. Their level stance is independent of track tangent.
  const cabins = [];
  const cabinShell = geometry(new RoundedBoxGeometry(.27, .32, .25, 2, .045));
  const cabinGlass = geometry(new THREE.BoxGeometry(.225, .18, .258));
  const cabinRoof = geometry(new THREE.BoxGeometry(.29, .025, .28));
  const cabinLight = geometry(new THREE.BoxGeometry(.14, .009, .263));
  for (let i = 0; i < 17; i++) {
    const cabin = new THREE.Group(); track.add(cabin);
    const shell = new THREE.Mesh(cabinShell, silver); cabin.add(shell);
    const window = new THREE.Mesh(cabinGlass, glass); window.position.y = .015; cabin.add(window);
    const roof = new THREE.Mesh(cabinRoof, champagne); roof.position.y = .175; cabin.add(roof);
    const light = new THREE.Mesh(cabinLight, i % 3 ? warm : cyan); light.position.y = -.089; cabin.add(light);
    cabins.push(cabin);
  }

  // Slim Art-Deco piers frame the wheel, leaving the centre open to the image.
  for (const side of [-1, 1]) {
    const pier = new THREE.Group(); pier.position.set(side * 1.74, -.08, -.34); architecture.add(pier);
    box(.39, 5.9, .46, .035, graphite, pier).position.y = .1;
    for (let level = 0; level < 3; level++) {
      box(.4 - level * .07, .38, .48 - level * .07, .025, silver, pier).position.y = 3.08 + level * .22;
    }
    for (let rib = 0; rib < 5; rib++) {
      box(.018, 5.84, .035, .006, rib % 2 ? gold : silver, pier).position.set((rib - 2) * .075, .09, .255);
    }
    box(.014, 4.9, .018, .004, warm, pier).position.set(side * .205, -.23, .22);
    const foot = box(.65, .18, .7, .04, gold, pier); foot.position.y = -2.92;
    for (let i = 0; i < 6; i++) {
      const fin = box(.032, 2.1 - i * .17, .085, .008, darkGold, architecture);
      fin.position.set(side * (1.94 + i * .12), -1.73 - i * .085, -.42);
    }
  }
  const base = addMesh(new THREE.CylinderGeometry(2.9, 3.02, .18, 96), graphite, sculpture);
  base.position.y = -3.16; base.scale.z = .56;
  const baseLip = addMesh(new THREE.TorusGeometry(2.96, .023, 8, 120), champagne, sculpture);
  baseLip.rotation.x = Math.PI / 2; baseLip.scale.y = .56; baseLip.position.y = -3.12;
  const plinth = box(4.55, .13, 1.05, .055, graphite, sculpture); plinth.position.y = -3.02;
  const baseInlay = addMesh(new THREE.TorusGeometry(2.67, .008, 6, 120), gold, sculpture);
  baseInlay.rotation.x = Math.PI / 2; baseInlay.scale.y = .56; baseInlay.position.y = -3.06;

  const glowUniforms = { uReveal: { value: 0 }, uTime: { value: 0 }, uMotion: { value: 1 } };
  const glowMaterial = material(new THREE.ShaderMaterial({
    uniforms: glowUniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv;uniform float uReveal;uniform float uTime;uniform float uMotion;
      void main(){if(vUv.x>uReveal)discard;float head=exp(-pow((vUv.x-uReveal)*34.,2.));
      float shimmer=.5+.5*sin(vUv.x*18.-uTime*.5);float alpha=.12+.2*shimmer*uMotion+.8*head;
      gl_FragColor=vec4(vec3(1.,.76,.38)*(1.+head),alpha);}`,
  }));
  addMesh(new THREE.TubeGeometry(new LandmarkCurve(1, .21), 256, .067, 8, true), glowMaterial, track);
  const hazeMaterial = material(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 vUv;void main(){vec2 p=vUv-.5;float a=exp(-dot(p*vec2(1.2,.8),p*vec2(1.2,.8))*18.);gl_FragColor=vec4(.57,.42,.2,a*.055);}',
  }));
  const haze = addMesh(new THREE.PlaneGeometry(8, 10), hazeMaterial, sculpture); haze.position.z = -.75;

  const count = 280, positions = new Float32Array(count * 3), sizes = new Float32Array(count);
  const phases = new Float32Array(count), colors = new Float32Array(count * 3);
  let seed = 1937;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - .5) * 8.5;
    positions[i * 3 + 1] = (random() - .5) * 8.5;
    positions[i * 3 + 2] = (random() - .5) * 3;
    sizes[i] = .6 + random() * 1.5; phases[i] = random() * TAU;
    const tint = new THREE.Color(i % 4 ? 0xe8cf9b : 0x8cb9c5);
    colors.set([tint.r, tint.g, tint.b], i * 3);
  }
  const dustGeo = geometry(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dustUniforms = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector3(30, 30, 0) },
    uPointerActive: { value: 0 }, uDpr: { value: 1 }, uMotion: { value: 1 } };
  const dustMat = material(new THREE.ShaderMaterial({
    uniforms: dustUniforms, transparent: true, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSize;attribute float aPhase;varying vec3 vColor;varying float vAlpha;
      uniform float uTime;uniform vec3 uPointer;uniform float uPointerActive;uniform float uDpr;uniform float uMotion;
      void main(){vec3 p=position;p.x+=sin(uTime*.12+aPhase)*.12*uMotion;p.y+=sin(uTime*.09+aPhase*2.)*.14*uMotion;
      vec2 delta=p.xy-uPointer.xy;float d=length(delta);float push=exp(-d*d*.85)*uPointerActive;
      p.xy+=normalize(delta+vec2(.001))*.55*push;p.z+=.3*push;
      vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
      gl_PointSize=clamp(aSize*uDpr*11./max(1.,-mv.z),1.,5.);vColor=color;
      vAlpha=(.28+.3*(.5+.5*sin(aPhase+uTime*.35*uMotion)))*(1.-smoothstep(3.4,5.5,length(position.xy)));}`,
    fragmentShader: 'varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);float a=exp(-d*d*20.)*vAlpha;gl_FragColor=vec4(vColor,a);}',
  }));
  scene.add(new THREE.Points(dustGeo, dustMat));

  let active = false, disposed = false, reduced = false, contextLost = false, hasLayout = false;
  let frameId = 0, previous = 0, elapsed = 0, reveal = 0, progress = 0, renderedProgress = 0;
  let yaw = -.22, pitch = .035, yawTarget = -.22, pitchTarget = .035, velocity = 0;
  let width = 1, height = 1, pointerId = null, gesture = 'none', touch = false, pointerActive = false;
  let originX = 0, originY = 0, lastX = 0, lastY = 0, interactionCount = 0, pointerMoves = 0;
  let ready = false, frames = 0;
  const pointer = new THREE.Vector2(), pointerSmooth = new THREE.Vector2();
  const raycaster = new THREE.Raycaster(), interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  function stop() { if (frameId) cancelAnimationFrame(frameId); frameId = 0; previous = 0; }
  function schedule() { if (!frameId && active && hasLayout && !disposed && !document.hidden && !contextLost) frameId = requestAnimationFrame(render); }
  function record() {
    Object.assign(canvas.dataset, { ready: String(ready), yaw: yaw.toFixed(4), pitch: pitch.toFixed(4),
      progress: renderedProgress.toFixed(4), reveal: reveal.toFixed(4), interactionCount: String(interactionCount),
      pointerMoves: String(pointerMoves), gesture, frames: String(frames) });
  }
  function resize() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    hasLayout = canvas.isConnected && rect.width > 1 && rect.height > 1;
    if (!hasLayout) { stop(); return; }
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, width < 600 ? 1.5 : 1.7);
    renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
    dustUniforms.uDpr.value = dpr; camera.aspect = width / height; camera.updateProjectionMatrix(); schedule();
  }
  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  }
  function pointerDown(event) {
    if (!active || event.button !== 0 || pointerId !== null) return;
    pointerId = event.pointerId; touch = event.pointerType === 'touch'; gesture = touch ? 'pending' : 'rotate';
    originX = lastX = event.clientX; originY = lastY = event.clientY; velocity = 0; updatePointer(event);
    pointerActive = !touch;
    if (!touch) canvas.setPointerCapture?.(pointerId);
    canvas.style.cursor = touch ? 'grab' : 'grabbing'; record();
  }
  function pointerMove(event) {
    if (!active) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    if (pointerId === event.pointerId) {
      if (gesture === 'pending') {
        const dx = Math.abs(event.clientX - originX), dy = Math.abs(event.clientY - originY);
        if (Math.max(dx, dy) < 9) return;
        gesture = dx > dy * 1.1 ? 'rotate' : 'scroll';
        if (gesture === 'rotate') { canvas.setPointerCapture?.(pointerId); canvas.style.cursor = 'grabbing'; }
        else { pointerActive = false; record(); return; }
      }
      if (gesture !== 'rotate') return;
      const dx = event.clientX - lastX, dy = touch ? 0 : event.clientY - lastY;
      yawTarget = clamp(yawTarget + dx * .005, -1.15, 1.15);
      pitchTarget = clamp(pitchTarget + dy * .002, -.18, .25);
      velocity = dx * .0008; lastX = event.clientX; lastY = event.clientY;
      interactionCount++; pointerActive = true; updatePointer(event);
    } else if (event.pointerType !== 'touch') {
      pointerActive = true; updatePointer(event); pointerMoves++;
    }
  }
  function release(event) {
    if (event && pointerId !== event.pointerId) return;
    if (pointerId !== null && canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
    if (touch) pointerActive = false;
    pointerId = null; gesture = 'none'; touch = false; canvas.style.cursor = 'grab'; record();
  }
  function leave() { if (pointerId === null) { pointerActive = false; pointer.set(0, 0); } }
  function keyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation();
    if (event.key === 'Home') resetView();
    else {
      yawTarget = clamp(yawTarget + (event.key === 'ArrowLeft' ? -.12 : event.key === 'ArrowRight' ? .12 : 0), -1.15, 1.15);
      pitchTarget = clamp(pitchTarget + (event.key === 'ArrowUp' ? -.06 : event.key === 'ArrowDown' ? .06 : 0), -.18, .25);
      interactionCount++; schedule();
    }
  }
  function resetView() { yawTarget = -.22; pitchTarget = .035; velocity = 0; interactionCount++; schedule(); }
  function render(now) {
    frameId = 0;
    if (!active || !hasLayout || disposed || document.hidden || contextLost) return;
    const dt = Math.min(previous ? (now - previous) / 1000 : 1 / 60, .05); previous = now;
    frames++; if (!reduced) elapsed += dt;
    const damping = reduced ? 1 : 1 - Math.exp(-dt * 7);
    reveal = reduced ? 1 : Math.min(1, reveal + dt * .48);
    renderedProgress = reduced ? progress : lerp(renderedProgress, progress, damping);
    const ease = reduced ? 0 : renderedProgress * renderedProgress * (3 - 2 * renderedProgress);
    if (gesture !== 'rotate' && !reduced) { yawTarget = clamp(yawTarget + velocity * dt * 30, -1.15, 1.15); velocity *= Math.exp(-dt * 8); }
    yaw = lerp(yaw, yawTarget, damping); pitch = lerp(pitch, pitchTarget, damping);
    pointerSmooth.lerp(pointerActive && !reduced ? pointer : new THREE.Vector2(), damping);
    sculpture.rotation.set(pitch + pointerSmooth.y * .018, yaw + pointerSmooth.x * .045 + (reduced ? 0 : ease * .16), -.025);
    floating.scale.setScalar(reduced ? 1 : 1 - ease * .12);
    floating.position.set(reduced ? 0 : ease * .32, (reduced ? 0 : Math.sin(elapsed * .35) * .025) - ease * .13, 0);
    const aspectScale = Math.max(1, .76 / camera.aspect);
    camera.position.set(0, .9, 12.5 * aspectScale); camera.lookAt(0, .05, 0); camera.updateMatrixWorld();
    for (const geo of rails) geo.setDrawRange(0, Math.floor(geo.index.count * reveal / 6) * 6);
    ties.visible = reveal > .15; braces.visible = reveal > .35;
    for (let i = 0; i < cabins.length; i++) {
      const t = (i / 17 + (reduced ? 0 : elapsed * .003)) % 1;
      curve.getPoint(t, cabins[i].position); cabins[i].position.z = .22;
      cabins[i].visible = i / 17 < reveal;
    }
    glowUniforms.uReveal.value = reveal; glowUniforms.uTime.value = elapsed;
    glowUniforms.uMotion.value = reduced ? 0 : 1;
    dustUniforms.uMotion.value = reduced ? 0 : 1; dustUniforms.uTime.value = elapsed;
    dustUniforms.uPointerActive.value = lerp(dustUniforms.uPointerActive.value, pointerActive && !reduced ? 1 : 0, damping);
    if (pointerActive) { raycaster.setFromCamera(pointer, camera); if (raycaster.ray.intersectPlane(interactionPlane, hit)) dustUniforms.uPointer.value.copy(hit); }
    rim.intensity = 5 + ease * 1.4;
    try {
      renderer.render(scene, camera);
      if (!ready) { ready = true; record(); onReady?.(); }
    } catch (error) { active = false; canvas.dataset.ready = 'false'; onError?.(error); return; }
    if (frames % 8 === 0) record();
    schedule();
  }
  function visibility() { if (document.hidden) stop(); else schedule(); }
  function loseContext(event) { event.preventDefault(); contextLost = true; stop(); canvas.dataset.ready = 'false'; onError?.(new Error('WebGL context lost')); }
  function restoreContext() { contextLost = false; ready = false; resize(); }
  canvas.style.touchAction = 'pan-y'; canvas.style.cursor = 'grab';
  if (!canvas.hasAttribute('tabindex')) canvas.tabIndex = 0;
  if (!canvas.hasAttribute('aria-label')) canvas.setAttribute('aria-label', '三维影汇地标：拖动或使用方向键旋转，Home 重置视角');
  const events = { pointerdown: pointerDown, pointermove: pointerMove, pointerup: release,
    pointercancel: release, pointerleave: leave, keydown: keyDown, webglcontextlost: loseContext, webglcontextrestored: restoreContext };
  for (const [name, fn] of Object.entries(events)) canvas.addEventListener(name, fn);
  document.addEventListener('visibilitychange', visibility);
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  resize(); record();

  return {
    setActive(value) { if (active === !!value) return; active = !!value; if (active) { resize(); schedule(); } else { stop(); release(); } },
    setProgress(value) { progress = clamp(Number(value) || 0, 0, 1); schedule(); },
    setReducedMotion(value) { reduced = !!value; if (reduced) { reveal = 1; velocity = 0; } schedule(); },
    resetView,
    getStats: () => ({ ready, active, reducedMotion: reduced, yaw, pitch, progress: renderedProgress, reveal,
      interactionCount, pointerMoves, frames, width, height, drawCalls: renderer.info.render.calls }),
    dispose() {
      if (disposed) return; disposed = true; stop(); release(); observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      for (const [name, fn] of Object.entries(events)) canvas.removeEventListener(name, fn);
      for (const geo of geometries) geo.dispose(); for (const mat of materials) mat.dispose();
      environmentTarget.dispose(); renderer.dispose();
    },
  };
}
