import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RELATION_TYPES, classifyRelation } from './relations.js';

const TAU = Math.PI * 2;
const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;
const SCROLL_SECTIONS = {
  opening: { distance: [1.035, 0.985], pitch: [0.024, -0.012] },
  stp: { distance: [1.025, 0.99], pitch: [0.018, -0.012] },
  mix: { distance: [1.025, 0.985], pitch: [0.016, -0.014] },
  evidence: { distance: [1.015, 1], pitch: [0.012, 0] },
  strategy: { distance: [1.025, 0.99], pitch: [0.018, -0.012] },
};
const NODE_POSITIONS = {
  hotel: [-3.05, 0, -0.65],
  water: [2.75, 0, -1.05],
  reel: [0, 0, -2.05],
  dining: [2.25, 0, 1.65],
  indoor: [-2.3, 0, 1.65],
  familyPlay: [0, 0, 2.3],
};
export const JOURNEY_NODE_IDS = Object.keys(NODE_POSITIONS);

// This is a relationship model for a proposed family journey, not a geographic model.
export function createJourneyScene({ canvas, onNodeSelect, onRelationHover, onReady, onError, onProject } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (error) {
    onError?.(error);
    return { setState() {}, setPhase() {}, setScrollProgress() {}, setSelected() {}, setMedia() {}, setReducedMotion() {}, setActive() {}, resetView() {},
      getStats: () => ({ ready: false, error: error.message }), dispose() {} };
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.setClearColor(0x080b10, 0);
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const selectable = [];
  const nodes = new Map();
  const activeRoutes = [];
  const rememberGeometry = (geometry) => { geometries.add(geometry); return geometry; };
  const rememberMaterial = (surface) => { materials.add(surface); return surface; };
  function mesh(geometry, surface, parent, nodeId) {
    const object = new THREE.Mesh(rememberGeometry(geometry), surface);
    if (parent) parent.add(object);
    if (nodeId) { object.userData.nodeId = nodeId; selectable.push(object); }
    return object;
  }
  function box(w, h, d, r, surface, parent, nodeId) {
    return mesh(new RoundedBoxGeometry(w, h, d, 2, r), surface, parent, nodeId);
  }
  function cylinder(radius, height, surface, parent, nodeId, segments = 64) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, segments), surface, parent, nodeId);
  }
  function ring(radius, tube, surface, parent, nodeId, vertical = false) {
    const object = mesh(new THREE.TorusGeometry(radius, tube, 8, 96), surface, parent, nodeId);
    if (!vertical) object.rotation.x = Math.PI / 2;
    return object;
  }

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentTarget.texture;
  scene.environmentIntensity = 0.65;
  scene.environmentRotation.set(0, -0.5, 0);
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xc3d8ef, 0x17110b, 1.3));
  const key = new THREE.RectAreaLight(0xffe8c5, 5.5, 6, 5);
  key.position.set(-3, 8, 6); key.lookAt(0, 0, 0); scene.add(key);
  const rim = new THREE.RectAreaLight(0xbadff0, 4.5, 3, 6);
  rim.position.set(5, 5, -4); rim.lookAt(0, 0.5, 0); scene.add(rim);
  const fill = new THREE.RectAreaLight(0xeab36f, 3, 4, 2);
  fill.position.set(-6, 2, -4); fill.lookAt(0, 0, 0); scene.add(fill);

  const gold = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0xc6aa7c, metalness: 0.95, roughness: 0.22, clearcoat: 0.3, envMapIntensity: 1.1 }));
  const paleGold = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0xe9d6af, metalness: 0.9, roughness: 0.29, clearcoat: 0.25 }));
  const graphite = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0x19222b, metalness: 0.75, roughness: 0.28, clearcoat: 0.65, envMapIntensity: 0.6 }));
  const black = rememberMaterial(new THREE.MeshStandardMaterial({ color: 0x0b1018, metalness: 0.55, roughness: 0.4 }));
  const silver = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0xbfcbd0, metalness: 1, roughness: 0.24 }));
  const glass = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0x638c9d, metalness: 0.3, roughness: 0.23, transmission: 0.2, thickness: 0.22, ior: 1.35, clearcoat: 0.45, specularIntensity: 0.4, envMapIntensity: 0.25 }));
  const waterGlass = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0x3e8391, metalness: 0.4, roughness: 0.12, transmission: 0.25, thickness: 0.15, clearcoat: 1, envMapIntensity: 0.6 }));
  const ivory = rememberMaterial(new THREE.MeshPhysicalMaterial({ color: 0xd9d4c4, metalness: 0.35, roughness: 0.34, clearcoat: 0.5 }));
  const cyanLight = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0x9bdddf, toneMapped: false }));
  const warmLight = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xf6d59a, toneMapped: false }));

  const island = new THREE.Group();
  scene.add(island);
  const turntable = new THREE.Group();
  island.add(turntable);
  const platform = cylinder(4.2, 0.16, black, turntable);
  platform.scale.z = 0.83;
  platform.position.y = -0.18;
  const bevel = cylinder(4.17, 0.07, graphite, turntable);
  bevel.scale.z = 0.83;
  bevel.position.y = -0.055;
  const outerRing = ring(4.16, 0.014, gold, turntable);
  outerRing.scale.y = 0.83;
  outerRing.position.y = -0.012;
  const innerRing = ring(3.94, 0.007, graphite, turntable);
  innerRing.scale.y = 0.83;
  innerRing.position.y = 0.002;
  const outerGlowMat = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xdcc394, transparent: true, opacity: 0.18, toneMapped: false }));
  const outerGlow = ring(4.16, 0.045, outerGlowMat, turntable);
  outerGlow.scale.y = 0.83;
  outerGlow.position.y = -0.08;

  const tickGeometry = rememberGeometry(new THREE.BoxGeometry(0.012, 0.01, 0.075));
  const ticks = new THREE.InstancedMesh(tickGeometry, gold, 100);
  const transform = new THREE.Object3D();
  for (let i = 0; i < 100; i++) {
    const a = i / 100 * TAU;
    transform.position.set(Math.sin(a) * 4.04, 0.005, Math.cos(a) * 3.35);
    transform.rotation.set(0, a, 0);
    transform.scale.set(1, 1, i % 5 === 0 ? 1 : 0.45);
    transform.updateMatrix(); ticks.setMatrixAt(i, transform.matrix);
  }
  turntable.add(ticks);

  // Delicate inlaid arcs give the object a designed surface without implying geographic roads.
  for (const radius of [1.15, 2.0, 2.85]) {
    const inset = ring(radius, 0.005, graphite, turntable);
    inset.scale.y = 0.83; inset.position.y = 0.007;
  }
  const centralDisc = cylinder(0.52, 0.025, graphite, turntable);
  centralDisc.position.y = 0.025;
  ring(0.53, 0.009, gold, turntable).position.y = 0.045;
  const centerOrbit = ring(0.36, 0.006, gold, turntable);
  centerOrbit.position.y = 0.045;

  const haloVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const haloFragment = `varying vec2 vUv; uniform vec3 uColor; uniform float uStrength; void main(){float r=length(vUv-.5); float glow=exp(-r*r*18.); float rim=pow(max(0.,1.-abs(r-.31)*17.),3.); gl_FragColor=vec4(uColor,(glow*.18+rim*.35)*uStrength);}`;
  for (const [id, position] of Object.entries(NODE_POSITIONS)) {
    const root = new THREE.Group(); root.position.fromArray(position); turntable.add(root);
    const model = new THREE.Group(); root.add(model);
    const pedestal = cylinder(0.78, 0.11, graphite, root, id); pedestal.position.y = 0.075;
    const lip = ring(0.76, 0.014, gold, root, id); lip.position.y = 0.135;
    const core = cylinder(0.66, 0.018, black, root, id); core.position.y = 0.14;
    const haloMat = rememberMaterial(new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(0xe8c996) }, uStrength: { value: 0.2 } },
      vertexShader: haloVertex, fragmentShader: haloFragment, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    const halo = mesh(new THREE.PlaneGeometry(2.6, 2.6), haloMat, root);
    halo.rotation.x = -Math.PI / 2; halo.position.y = 0.017;
    const signalMat = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xe8c996, transparent: true, opacity: 0.2, toneMapped: false }));
    const signal = ring(0.7, 0.011, signalMat, root); signal.position.y = 0.16;
    const selectionMat = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xffe7b5, transparent: true, opacity: 0, toneMapped: false }));
    const selection = ring(0.91, 0.012, selectionMat, root); selection.position.y = 0.014;
    const labelAnchor = new THREE.Object3D();
    labelAnchor.position.set(0, -0.01, 0.86); root.add(labelAnchor);
    nodes.set(id, { root, model, haloMat, signalMat, selectionMat, signal, labelAnchor, active: 0.3, target: 0.3 });
  }

  const hotel = nodes.get('hotel').model;
  for (let i = 0; i < 3; i++) {
    const h = [1.23, 1.75, 1.46][i];
    const x = (i - 1) * 0.36;
    const tower = box(0.29, h, 0.44, 0.025, glass, hotel, 'hotel'); tower.position.set(x, h / 2 + 0.17, 0);
    const roof = box(0.32, 0.045, 0.47, 0.01, gold, hotel, 'hotel'); roof.position.set(x, h + 0.19, 0);
    for (let side = -1; side <= 1; side += 2) {
      const trim = box(0.018, h, 0.018, 0.003, paleGold, hotel, 'hotel'); trim.position.set(x + side * 0.135, h / 2 + 0.19, 0.23);
    }
    for (let j = 1; j < 9; j++) {
      const floor = box(0.26, 0.012, 0.012, 0.002, paleGold, hotel, 'hotel'); floor.position.set(x, 0.19 + j / 9 * h, 0.229);
    }
  }
  box(1.2, 0.12, 0.68, 0.04, graphite, hotel, 'hotel').position.y = 0.2;

  const reel = nodes.get('reel').model;
  const reelStand = box(0.78, 0.14, 0.46, 0.035, graphite, reel, 'reel'); reelStand.position.y = 0.21;
  const loopRadius = 0.395;
  for (let k = 0; k < 2; k++) {
    const y = 0.69 + k * 0.75;
    const loop = ring(loopRadius, 0.062, gold, reel, 'reel', true); loop.position.set(0, y, 0);
    const rearLoop = ring(loopRadius, 0.026, paleGold, reel, 'reel', true); rearLoop.position.set(0, y, -0.18);
    const glowLoop = ring(loopRadius - 0.06, 0.009, warmLight, reel, 'reel', true); glowLoop.position.set(0, y, 0.035);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * TAU;
      const bridge = box(0.025, 0.025, 0.19, 0.004, paleGold, reel, 'reel'); bridge.position.set(Math.sin(a) * loopRadius, y + Math.cos(a) * loopRadius, -0.09);
    }
  }
  for (let side = -1; side <= 1; side += 2) {
    const pillar = box(0.07, 1.62, 0.09, 0.01, gold, reel, 'reel'); pillar.position.set(side * 0.51, 0.99, -0.16);
  }

  const water = nodes.get('water').model;
  for (let i = 0; i < 3; i++) {
    const radius = 0.58 - i * 0.125;
    const basin = cylinder(radius, 0.12, waterGlass, water, 'water'); basin.position.y = 0.26 + i * 0.2;
    const rim = ring(radius, 0.016, cyanLight, water, 'water'); rim.position.y = 0.32 + i * 0.2;
    const waterFace = cylinder(radius - 0.04, 0.014, waterGlass, water, 'water'); waterFace.position.y = 0.325 + i * 0.2;
  }
  const wavePoints = [];
  for (let i = 0; i <= 90; i++) {
    const t = i / 90;
    wavePoints.push(new THREE.Vector3(Math.cos(t * TAU * 1.6) * (0.58 - t * 0.2), 0.38 + t * 0.73, Math.sin(t * TAU * 1.6) * (0.58 - t * 0.2)));
  }
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wavePoints), 120, 0.045, 8, false), waterGlass, water, 'water');
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(wavePoints), 120, 0.012, 6, false), cyanLight, water, 'water');

  const dining = nodes.get('dining').model;
  cylinder(0.48, 0.06, gold, dining, 'dining').position.y = 0.95;
  const canopy = mesh(new THREE.ConeGeometry(0.59, 0.22, 8), paleGold, dining, 'dining'); canopy.position.y = 1.08; canopy.rotation.y = Math.PI / 8;
  const innerLight = cylinder(0.41, 0.018, warmLight, dining, 'dining'); innerLight.position.y = 0.916;
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * TAU;
    const pillar = cylinder(0.025, 0.72, gold, dining, 'dining', 8); pillar.position.set(Math.sin(a) * 0.44, 0.56, Math.cos(a) * 0.44);
  }
  cylinder(0.28, 0.045, ivory, dining, 'dining').position.y = 0.53;
  cylinder(0.055, 0.32, gold, dining, 'dining', 12).position.y = 0.35;

  const indoor = nodes.get('indoor').model;
  box(1.04, 0.08, 0.65, 0.02, gold, indoor, 'indoor').position.y = 0.23;
  for (let i = 0; i < 4; i++) {
    const archShape = new THREE.Shape();
    const outer = 0.5, inner = 0.42;
    archShape.moveTo(-outer, 0); archShape.lineTo(-outer, 0.55);
    archShape.absarc(0, 0.55, outer, Math.PI, 0, true);
    archShape.lineTo(outer, 0); archShape.lineTo(inner, 0); archShape.lineTo(inner, 0.55);
    archShape.absarc(0, 0.55, inner, 0, Math.PI, false);
    archShape.lineTo(-inner, 0); archShape.closePath();
    const arch = mesh(new THREE.ExtrudeGeometry(archShape, { depth: 0.045, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 30 }), i % 2 ? gold : paleGold, indoor, 'indoor');
    arch.position.set(0, 0.26, -0.3 + i * 0.19);
  }
  const innerPanel = box(0.72, 0.55, 0.035, 0.025, glass, indoor, 'indoor'); innerPanel.position.set(0, 0.55, -0.33);

  // Abstract play blocks distinguish the children's venue from the indoor water park.
  const familyPlay = nodes.get('familyPlay').model;
  for (let i = 0; i < 3; i++) {
    const height = [0.38, 0.76, 0.52][i];
    const block = box(0.3, height, 0.42, 0.045, i === 1 ? glass : ivory, familyPlay, 'familyPlay');
    block.position.set((i - 1) * 0.34, 0.2 + height / 2, 0);
    const cap = box(0.32, 0.035, 0.44, 0.01, gold, familyPlay, 'familyPlay');
    cap.position.set((i - 1) * 0.34, 0.22 + height, 0);
  }
  const playLoop = ring(0.24, 0.035, paleGold, familyPlay, 'familyPlay', true);
  playLoop.position.set(0, 1.24, 0);

  // Each node keeps a small, shared-within-node palette so its emphasis can change independently.
  for (const node of nodes.values()) {
    const palette = new Map();
    node.model.traverse((object) => {
      if (!object.isMesh || !object.material) return;
      const original = object.material;
      if (!palette.has(original)) {
        const surface = rememberMaterial(original.clone());
        palette.set(original, { surface, color: surface.color?.clone(), env: surface.envMapIntensity });
      }
      object.material = palette.get(original).surface;
    });
    node.palette = [...palette.values()];
    node.lastBrightness = -1;
  }

  // Sparse luminous motes respond locally to the pointer, independent of camera rotation.
  const dustCount = 800;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustSeeds = new Float32Array(dustCount);
  let seed = 71;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (random() - 0.5) * 13;
    dustPositions[i * 3 + 1] = random() * 5 - 0.4;
    dustPositions[i * 3 + 2] = (random() - 0.5) * 9;
    dustSeeds[i] = random();
  }
  const dustGeometry = rememberGeometry(new THREE.BufferGeometry());
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('aSeed', new THREE.BufferAttribute(dustSeeds, 1));
  const dustUniforms = { uTime: { value: 0 }, uPointer: { value: new THREE.Vector3(100, 100, 100) }, uActive: { value: 0 }, uDpr: { value: 1 } };
  const dustMaterial = rememberMaterial(new THREE.ShaderMaterial({
    uniforms: dustUniforms,
    vertexShader: `attribute float aSeed; uniform float uTime; uniform vec3 uPointer; uniform float uActive; uniform float uDpr; varying float vLight; void main(){vec3 p=position; p.y+=sin(uTime*.15+aSeed*40.)*.06; vec3 diff=p-uPointer; float d=length(diff); float influence=exp(-d*d*.8)*uActive; p+=normalize(diff+vec3(.001))*influence*.26; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=min(5.,(1.0+aSeed*1.2+influence*2.)*uDpr*8./max(5.,-mv.z)); vLight=.10+aSeed*.27+influence*.6;}`,
    fragmentShader: `varying float vLight; void main(){float d=length(gl_PointCoord-.5); if(d>.5)discard; float a=pow(1.-d*2.,2.); gl_FragColor=vec4(vec3(.84,.78,.63),a*vLight);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  const dust = new THREE.Points(dustGeometry, dustMaterial); scene.add(dust);

  const mediaRoot = new THREE.Group(); scene.add(mediaRoot); mediaRoot.visible = false;
  const mediaMaterial = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  const mediaPlane = mesh(new THREE.PlaneGeometry(1, 1), mediaMaterial, mediaRoot);
  // The evidence window stays legible when its lower edge crosses a node silhouette.
  mediaMaterial.depthTest = false;
  mediaPlane.renderOrder = 50;
  const backing = box(1, 1, 0.035, 0.015, black, mediaRoot);
  backing.position.z = -0.035;
  const frameBars = [];
  for (let i = 0; i < 4; i++) frameBars.push(box(1, 1, 0.035, 0.008, gold, mediaRoot));
  const edgeGlowMaterial = rememberMaterial(new THREE.MeshBasicMaterial({ color: 0xdac291, transparent: true, opacity: 0, toneMapped: false }));
  const edgeGlow = mesh(new THREE.PlaneGeometry(1, 1), edgeGlowMaterial, mediaRoot);
  edgeGlow.position.z = -0.06;
  const mediaCorners = [];
  for (let i = 0; i < 4; i++) mediaCorners.push(box(0.035, 0.035, 0.06, 0.004, paleGold, mediaRoot));

  let mediaTexture = null;
  let mediaElement = null;
  let mediaType = null;
  let mediaAspect = 16 / 9;
  let disposed = false;
  let active = true;
  let hasLayout = false;
  let contextLost = false;
  let ready = false;
  let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phase = 'family';
  let selectedId = null;
  let hoverId = null;
  let hoveredRelation = null, relationHoverStamp = '';
  let phaseBlend = 0;
  let routeBlend = 0.2;
  // Scroll only changes the camera and reveal amounts. User rotation remains its
  // own transform, so scrolling never discards a manually chosen viewpoint.
  let scrollSection = null, scrollProgress = 0, scrollRenderedProgress = 0;
  let scrollDistance = 1, scrollPitch = 0, scrollMediaExpansion = 1;
  const scrollRouteReveal = 1; // Preserve diagnostics: reading progress never clips a relationship.
  let family = 'school';
  let stay = 'day';
  let routeIds = [];
  const accent = new THREE.Color(0xe8c996);
  let width = 1, height = 1, mobile = false;
  let dragging = false, pointerActive = false, pointerId = null;
  let downPosition = null, lastPosition = null, pointerTravel = 0;
  let pointerGesture = 'none', touchPointer = false;
  const rotation = new THREE.Vector2();
  const velocity = new THREE.Vector2();
  const pointer = new THREE.Vector2(5, 5);
  const raycaster = new THREE.Raycaster();
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const groundHit = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const anchorWorld = new THREE.Vector3();
  const projectionRay = new THREE.Raycaster();
  const projectionPointer = new THREE.Vector2();
  const mediaPosition = new THREE.Vector3();
  let projectionStamp = '';
  let previousTime = 0, motionTime = 0, frameId = 0;
  let sampleTime = 0, frameCount = 0, fps = 0;
  let lastError = null;

  const routeVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const routeFragment = `varying vec2 vUv; uniform vec3 uColor; uniform float uTime; uniform float uOpacity; uniform float uReveal; uniform float uOffset; uniform float uSegments; uniform float uFlow; void main(){if(vUv.x>uReveal)discard; float path=(vUv.x+uOffset)/uSegments; float head=fract(uTime*.075*uFlow); float behind=fract(head-path+1.); float signal=exp(-behind*behind*500.)*uFlow; float delta=(vUv.x-uReveal)*24.; float lead=exp(-delta*delta); float strength=.78+signal*.22+lead*.18; vec3 glow=mix(uColor,vec3(1.,.97,.9),signal*.32); gl_FragColor=vec4(glow*(1.+signal*.25),uOpacity*strength);}`;

  function clearRelationHover() {
    if (!hoveredRelation && !relationHoverStamp) return;
    hoveredRelation = null; relationHoverStamp = '';
    onRelationHover?.(null);
  }

  // Low arcs leave from the edge of each pedestal. Candidate bows avoid the
  // footprints of unrelated buildings and separate links instead of cutting
  // through the centre of the miniature architecture.
  function relationCurve(from, to, earlierSegments) {
    const a = new THREE.Vector3(...NODE_POSITIONS[from]);
    const b = new THREE.Vector3(...NODE_POSITIONS[to]);
    const delta = b.clone().sub(a), distance = delta.length();
    const normal = new THREE.Vector3(-delta.z, 0, delta.x).normalize();
    const middle = a.clone().lerp(b, .5);
    const obstacles = Object.entries(NODE_POSITIONS).filter(([id]) => id !== from && id !== to).map(([, p]) => p);
    let bestCurve, bestSamples, bestScore = Infinity;
    for (const bow of [0, .35, -.35, .7, -.7, 1.1, -1.1, 1.5, -1.5]) {
      for (const lift of [0, .24, .48]) {
        const mid = middle.clone().addScaledVector(normal, bow);
        const start = a.clone().addScaledVector(mid.clone().sub(a).normalize(), .84);
        const end = b.clone().addScaledVector(mid.clone().sub(b).normalize(), .84);
        start.y = end.y = .19;
        mid.y = .43 + distance * .035 + lift;
        const first = start.clone().lerp(mid, .48), last = end.clone().lerp(mid, .48);
        first.y = last.y = .19 + (mid.y - .19) * .8;
        const curve = new THREE.CatmullRomCurve3([start, first, mid, last, end], false, 'centripetal');
        const samples = curve.getPoints(36);
        let score = Math.abs(bow) * .3 + lift * .7;
        for (let i = 1; i < samples.length - 1; i++) {
          const p = samples[i];
          for (const position of obstacles) {
            const clearance = Math.hypot(p.x - position[0], p.z - position[2]);
            if (clearance < 1) score += (1 - clearance) ** 2 * 180;
          }
          // Keep the connection above the display base rather than outside it.
          const edge = p.x * p.x / 4.1 ** 2 + p.z * p.z / 3.4 ** 2;
          if (edge > 1) score += (edge - 1) * 12;
          for (const earlier of earlierSegments) {
            for (let j = 2; j < earlier.samples.length - 2; j++) {
              const q = earlier.samples[j];
              const separation = p.distanceTo(q);
              if (separation < .32) score += (.32 - separation) ** 2 * 24;
            }
          }
        }
        if (score < bestScore) { bestScore = score; bestCurve = curve; bestSamples = samples; }
      }
    }
    return { curve: bestCurve, samples: bestSamples };
  }

  function disposeRoute(record) {
    turntable.remove(record.group);
    for (const geo of record.geometries) geo.dispose();
    for (const mat of record.materials) mat.dispose();
  }
  function rebuildRoute(ids) {
    clearRelationHover();
    // A hidden chapter has no animation loop to retire old routes. Keep only the
    // currently visible outgoing route during a transition, never an unbounded queue.
    for (let i = activeRoutes.length - 1; i >= 0; i--) {
      const previous = activeRoutes[i];
      if (!active || previous.retiring || previous.opacity < 0.005) {
        disposeRoute(previous);
        activeRoutes.splice(i, 1);
      } else previous.retiring = true;
    }
    if (ids.length < 2) return;
    const record = { group: new THREE.Group(), geometries: [], materials: [], segments: [], opacity: 0, reveal: reducedMotion ? 1 : 0, retiring: false };
    turntable.add(record.group);
    for (let index = 0; index < ids.length - 1; index++) {
      const from = ids[index], to = ids[index + 1], type = classifyRelation(from, to);
      const { color: colorHex, label } = RELATION_TYPES[type];
      const color = new THREE.Color(colorHex);
      const { curve, samples } = relationCurve(from, to, record.segments);
      const uniforms = { uColor: { value: color.clone() }, uTime: { value: 0 }, uOpacity: { value: 0 }, uReveal: { value: 0 }, uOffset: { value: index }, uSegments: { value: ids.length - 1 }, uFlow: { value: reducedMotion ? 0 : 1 } };
      const surface = new THREE.ShaderMaterial({ uniforms, vertexShader: routeVertex, fragmentShader: routeFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const geo = new THREE.TubeGeometry(curve, 80, 0.028, 8, false);
      const line = new THREE.Mesh(geo, surface); record.group.add(line);
      const glowSurface = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
      const glowGeo = new THREE.TubeGeometry(curve, 80, 0.07, 8, false);
      const glow = new THREE.Mesh(glowGeo, glowSurface); record.group.add(glow);
      const hazeSurface = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
      const hazeGeo = new THREE.TubeGeometry(curve, 80, 0.12, 8, false);
      const haze = new THREE.Mesh(hazeGeo, hazeSurface); record.group.add(haze);
      const beadSurface = new THREE.MeshBasicMaterial({ color: color.clone().lerp(new THREE.Color(0xffffff), .2), transparent: true, opacity: 0, toneMapped: false });
      const beadGeo = new THREE.SphereGeometry(0.046, 12, 8);
      const bead = new THREE.Mesh(beadGeo, beadSurface); record.group.add(bead);
      record.geometries.push(geo, glowGeo, hazeGeo, beadGeo);
      record.materials.push(surface, glowSurface, hazeSurface, beadSurface);
      // Unrendered, wider geometry makes a delicate line easy to point at. It
      // shares the haze geometry, so it needs no additional GPU resource.
      const hitMesh = new THREE.Mesh(hazeGeo, hazeSurface);
      record.segments.push({ from, to, type, label, color: colorHex, curve, samples, hitMesh, uniforms, glowSurface, glow, hazeSurface, haze, beadSurface, bead, index, emphasis: 1 });
    }
    activeRoutes.push(record);
  }

  function stopRendering() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    previousTime = 0;
    sampleTime = 0;
    frameCount = 0;
  }

  function scheduleFrame() {
    if (!disposed && active && hasLayout && !contextLost && !document.hidden && !frameId) {
      frameId = requestAnimationFrame(render);
    }
  }

  function resize() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    // During a chapter move or display:none, preserve the last real framebuffer
    // instead of overwriting it with a 1×1 canvas and a misleading camera aspect.
    hasLayout = canvas.isConnected && rect.width >= 2 && rect.height >= 2;
    if (!hasLayout) { stopRendering(); return; }
    width = rect.width; height = rect.height;
    mobile = width < 650;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.7);
    renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
    dustUniforms.uDpr.value = dpr;
    camera.aspect = width / height;
    camera.fov = 37;
    camera.updateProjectionMatrix();
    projectionStamp = '';
    scheduleFrame();
  }

  function hitNode() {
    raycaster.setFromCamera(pointer, camera);
    // The evidence texture is intentionally a foreground window (depthTest:false).
    // Respect that visual occlusion even when a model is geometrically nearer.
    if (mediaRoot.visible && phaseBlend > 0.35 && raycaster.intersectObject(mediaPlane, false).length) return null;
    const hit = raycaster.intersectObjects(selectable, false)[0];
    return hit?.object.userData.nodeId || null;
  }
  function updateRelationHover(event) {
    if (hoverId || dragging) { clearRelationHover(); return; }
    let nearest = null;
    for (const record of activeRoutes) {
      if (record.retiring || record.opacity < .2) continue;
      for (const segment of record.segments) {
        segment.hitMesh.matrixWorld.copy(record.group.matrixWorld);
        const hit = raycaster.intersectObject(segment.hitMesh, false).find((candidate) => candidate.uv && candidate.uv.x <= segment.uniforms.uReveal.value);
        if (hit && (!nearest || hit.distance < nearest.distance)) nearest = { segment, distance: hit.distance };
      }
    }
    if (!nearest) { clearRelationHover(); return; }
    hoveredRelation = nearest.segment;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left), y = Math.round(event.clientY - rect.top);
    const { from, to, type, label } = hoveredRelation;
    const stamp = `${from}:${to}:${x}:${y}`;
    if (stamp !== relationHoverStamp) {
      relationHoverStamp = stamp;
      onRelationHover?.({ from, to, type, label, x, y });
    }
  }
  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
  }
  function pointerDown(event) {
    if (!active || !hasLayout || event.button !== 0 || pointerId !== null) return;
    clearRelationHover();
    updatePointer(event); pointerId = event.pointerId;
    touchPointer = event.pointerType === 'touch';
    pointerGesture = touchPointer ? 'pending' : 'rotate';
    pointerActive = !touchPointer; dragging = !touchPointer;
    downPosition = [event.clientX, event.clientY]; lastPosition = [...downPosition]; pointerTravel = 0; velocity.set(0, 0);
    if (!touchPointer) canvas.setPointerCapture?.(event.pointerId);
    canvas.style.cursor = dragging ? 'grabbing' : 'grab';
    canvas.dataset.gesture = pointerGesture;
  }
  function pointerMove(event) {
    if (!active || !hasLayout) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    if (event.pointerId === pointerId) {
      const totalX = event.clientX - downPosition[0], totalY = event.clientY - downPosition[1];
      pointerTravel = Math.max(pointerTravel, Math.hypot(totalX, totalY));
      if (pointerGesture === 'pending') {
        const x = Math.abs(totalX), y = Math.abs(totalY);
        if (pointerTravel < 9 || (pointerTravel < 18 && Math.max(x, y) < Math.min(x, y) * 1.15)) return;
        pointerGesture = y >= x ? 'scroll' : 'rotate';
        canvas.dataset.gesture = pointerGesture;
        if (pointerGesture === 'scroll') {
          pointerActive = false; hoverId = null; velocity.set(0, 0);
          if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
          return;
        }
        dragging = true; pointerActive = true; lastPosition = [event.clientX, event.clientY];
        canvas.setPointerCapture?.(event.pointerId); canvas.style.cursor = 'grabbing';
        return;
      }
      if (pointerGesture !== 'rotate') return;
      updatePointer(event); pointerActive = true;
      const dx = event.clientX - lastPosition[0], dy = touchPointer ? 0 : event.clientY - lastPosition[1];
      const factor = mobile ? 0.0044 : 0.0034;
      rotation.y = clamp(rotation.y + dx * factor, -0.82, 0.82);
      rotation.x = clamp(rotation.x + dy * factor * 0.34, -0.19, 0.2);
      velocity.set(dy * factor * 0.34, dx * factor); lastPosition = [event.clientX, event.clientY];
    } else if (event.pointerType !== 'touch') {
      updatePointer(event); pointerActive = true;
      hoverId = hitNode(); updateRelationHover(event);
      canvas.style.cursor = hoverId ? 'pointer' : hoveredRelation ? 'help' : 'grab';
    }
  }
  function pointerUp(event) {
    if (event.pointerId !== pointerId) return;
    pointerTravel = Math.max(pointerTravel, Math.hypot(event.clientX - downPosition[0], event.clientY - downPosition[1]));
    const tap = pointerGesture !== 'scroll' && pointerTravel < 6;
    updatePointer(event); dragging = false;
    const selected = tap ? hitNode() : null;
    if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (touchPointer) { pointerActive = false; hoverId = null; }
    pointerId = null; downPosition = null; lastPosition = null; pointerTravel = 0;
    pointerGesture = 'none'; touchPointer = false; canvas.dataset.gesture = 'none'; canvas.style.cursor = 'grab';
    if (selected) onNodeSelect?.(selected);
  }
  function pointerLeave() {
    clearRelationHover();
    if (pointerId !== null && !dragging) pointerCancel();
    else if (!dragging) { pointerActive = false; hoverId = null; canvas.style.cursor = 'grab'; }
  }
  function pointerCancel(event) {
    if (event && event.pointerId !== pointerId) return;
    clearRelationHover();
    if (pointerId !== null && canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
    dragging = false; pointerId = null; pointerActive = false; hoverId = null; velocity.set(0, 0);
    downPosition = null; lastPosition = null; pointerTravel = 0; pointerGesture = 'none'; touchPointer = false;
    canvas.dataset.gesture = 'none'; canvas.style.cursor = 'grab';
  }
  canvas.addEventListener('pointerdown', pointerDown);
  canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp);
  canvas.addEventListener('pointerleave', pointerLeave);
  canvas.addEventListener('pointercancel', pointerCancel);
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y';

  function fitMedia() {
    if (!mediaElement) return;
    const baseHeight = Math.min(2.55, 4.65 / mediaAspect);
    const w = baseHeight * mediaAspect, h = baseHeight;
    mediaPlane.scale.set(w, h, 1);
    backing.scale.set(w + 0.12, h + 0.12, 1);
    frameBars[0].scale.set(w + 0.14, 0.018, 1); frameBars[0].position.set(0, h / 2 + 0.055, 0.01);
    frameBars[1].scale.set(w + 0.14, 0.018, 1); frameBars[1].position.set(0, -h / 2 - 0.055, 0.01);
    frameBars[2].scale.set(0.018, h + 0.14, 1); frameBars[2].position.set(-w / 2 - 0.055, 0, 0.01);
    frameBars[3].scale.set(0.018, h + 0.14, 1); frameBars[3].position.set(w / 2 + 0.055, 0, 0.01);
    edgeGlow.scale.set(w + 0.19, h + 0.19, 1);
    mediaCorners.forEach((corner, index) => corner.position.set((index % 2 ? 1 : -1) * (w / 2 + 0.055), (index < 2 ? 1 : -1) * (h / 2 + 0.055), 0.03));
  }

  function updateProjection() {
    const values = [];
    for (const [id, node] of nodes) {
      node.labelAnchor.getWorldPosition(anchorWorld); projected.copy(anchorWorld).project(camera);
      let hiddenByImage = false;
      if (mediaRoot.visible && phaseBlend > 0.65) {
        projectionPointer.set(projected.x, projected.y); projectionRay.setFromCamera(projectionPointer, camera);
        const imageHit = projectionRay.intersectObject(mediaPlane, false)[0];
        hiddenByImage = !!imageHit;
      }
      values.push({ id, x: (projected.x + 1) * width * 0.5, y: (-projected.y + 1) * height * 0.5, visible: !hiddenByImage && projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < 1.12 && Math.abs(projected.y) < 1.1 });
    }
    const stamp = values.map(({ x, y, visible }) => `${Math.round(x)},${Math.round(y)},${+visible}`).join('|');
    if (stamp !== projectionStamp) { projectionStamp = stamp; onProject?.(values); }
  }

  function render(now) {
    frameId = 0;
    if (disposed || !active || !hasLayout || contextLost || document.hidden) return;
    const elapsed = previousTime ? (now - previousTime) / 1000 : 1 / 60;
    const dt = Math.min(elapsed, 0.05); previousTime = now;
    frameCount++; sampleTime += elapsed;
    if (sampleTime > 0.6) { fps = Math.round(frameCount / sampleTime); frameCount = 0; sampleTime = 0; }
    if (!reducedMotion) motionTime += dt;
    const damping = reducedMotion ? 1 : 1 - Math.exp(-dt * 7);
    scrollRenderedProgress = reducedMotion ? 1 : lerp(scrollRenderedProgress, scrollProgress, damping);
    const scrollEase = scrollRenderedProgress * scrollRenderedProgress * (3 - 2 * scrollRenderedProgress);
    const scrollSettings = !reducedMotion && scrollSection ? SCROLL_SECTIONS[scrollSection] : null;
    scrollDistance = lerp(scrollDistance, scrollSettings ? lerp(...scrollSettings.distance, scrollEase) : 1, damping);
    scrollPitch = lerp(scrollPitch, scrollSettings ? lerp(...scrollSettings.pitch, scrollEase) : 0, damping);
    scrollMediaExpansion = scrollSettings && scrollSection === 'evidence' ? lerp(0.84, 1, scrollEase) : 1;
    phaseBlend = lerp(phaseBlend, phase === 'evidence' ? 1 : 0, damping);
    routeBlend = lerp(routeBlend, phase === 'family' ? 0.28 : 1, damping);
    if (!dragging && !reducedMotion) {
      rotation.x = clamp(rotation.x + velocity.x * dt * 35, -0.19, 0.2);
      rotation.y = clamp(rotation.y + velocity.y * dt * 35, -0.82, 0.82);
      velocity.multiplyScalar(Math.exp(-dt * 8));
    }
    turntable.rotation.set(rotation.x, rotation.y, 0);
    island.position.y = lerp(0, -1.05, phaseBlend);
    island.scale.setScalar(lerp(1, 0.89, phaseBlend));
    const aspectCompensation = Math.max(1, 1.35 / camera.aspect);
    const distanceScale = Math.sqrt(aspectCompensation) * scrollDistance;
    const baseY = 6.9 * distanceScale, baseZ = 10.1 * distanceScale;
    camera.position.set(0, 0.45 + (baseY - 0.45) * Math.cos(scrollPitch) + baseZ * Math.sin(scrollPitch),
      baseZ * Math.cos(scrollPitch) - (baseY - 0.45) * Math.sin(scrollPitch));
    camera.lookAt(0, 0.45, 0);
    camera.updateMatrixWorld();
    dustUniforms.uTime.value = motionTime;
    dustUniforms.uActive.value = lerp(dustUniforms.uActive.value, pointerActive && !reducedMotion ? 1 : 0, damping);
    if (pointerActive && !reducedMotion) {
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.ray.intersectPlane(groundPlane, groundHit)) dustUniforms.uPointer.value.copy(groundHit);
    }
    for (const [id, node] of nodes) {
      node.active = lerp(node.active, node.target, damping);
      const emphasis = id === selectedId ? 1 : id === hoverId ? 0.6 : 0;
      const brightness = Math.min(1, 0.48 + node.active * 0.52 + emphasis * 0.4);
      if (Math.abs(brightness - node.lastBrightness) > 0.001) {
        for (const { surface, color, env } of node.palette) {
          if (color) surface.color.copy(color).multiplyScalar(brightness);
          if (env !== undefined) surface.envMapIntensity = env * (0.45 + brightness * 0.55);
        }
        node.lastBrightness = brightness;
      }
      const arrivalIndex = routeIds.indexOf(id);
      const arrival = arrivalIndex >= 0 && !reducedMotion ? Math.exp(-Math.pow((((motionTime * 0.075 - arrivalIndex / Math.max(1, routeIds.length - 1)) % 1) + 1) % 1 * 12, 2)) * routeBlend : 0;
      node.haloMat.uniforms.uColor.value.copy(accent);
      node.haloMat.uniforms.uStrength.value = node.active * 0.95 + emphasis * 0.65 + arrival * 0.8;
      node.signalMat.color.copy(accent);
      node.signalMat.opacity = 0.12 + node.active * 0.65;
      node.selectionMat.opacity = lerp(node.selectionMat.opacity, emphasis * 0.65, damping);
      node.model.position.y = lerp(node.model.position.y, node.active * 0.08 + emphasis * 0.07, damping);
      node.signal.scale.setScalar(1 + (reducedMotion ? 0 : Math.sin(motionTime * 1.4 + node.root.position.x) * 0.008) * node.active);
    }
    for (let i = activeRoutes.length - 1; i >= 0; i--) {
      const record = activeRoutes[i];
      record.opacity = lerp(record.opacity, record.retiring ? 0 : 1, damping);
      record.reveal = reducedMotion ? 1 : Math.min(1, record.reveal + dt * 0.82);
      // Only a newly rebuilt combination draws in. Once readable, every link
      // remains complete regardless of chapter progress or an expanded image.
      const renderedReveal = record.reveal;
      const count = record.segments.length;
      for (const segment of record.segments) {
        const reveal = clamp(renderedReveal * count - segment.index, 0, 1);
        const related = selectedId === segment.from || selectedId === segment.to;
        const focused = hoveredRelation === segment;
        const emphasis = focused || related ? 1 : routeIds.includes(selectedId) || hoveredRelation ? .48 : .86;
        segment.emphasis = lerp(segment.emphasis, emphasis, damping);
        const opacity = record.opacity * routeBlend * segment.emphasis;
        segment.uniforms.uTime.value = motionTime;
        segment.uniforms.uOpacity.value = opacity;
        segment.uniforms.uReveal.value = reveal;
        segment.uniforms.uFlow.value = reducedMotion ? 0 : 1;
        segment.glow.visible = reveal >= 0.999;
        segment.glowSurface.opacity = opacity * 0.17;
        segment.haze.visible = reveal >= 0.999;
        segment.hazeSurface.opacity = opacity * 0.035;
        const globalProgress = ((motionTime * 0.075) % 1) * count;
        const beadPosition = reducedMotion ? 0.5 : clamp(globalProgress - segment.index, 0, 1);
        segment.bead.position.copy(segment.curve.getPoint(beadPosition));
        segment.bead.visible = reducedMotion ? reveal >= 0.5 : globalProgress >= segment.index && globalProgress < segment.index + 1 && reveal >= beadPosition;
        segment.beadSurface.opacity = opacity;
      }
      if (record.retiring && record.opacity < 0.005) { disposeRoute(record); activeRoutes.splice(i, 1); }
    }

    mediaRoot.visible = phaseBlend > 0.005 && !!mediaElement;
    if (mediaRoot.visible) {
      mediaRoot.quaternion.copy(camera.quaternion);
      mediaPosition.set(0, lerp(1.05, 1.8, phaseBlend), 0.45);
      mediaRoot.position.copy(mediaPosition);
      const mediaDistance = camera.position.distanceTo(mediaPosition);
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * mediaDistance;
      const mediaScale = Math.min(
        visibleHeight * camera.aspect * (mobile ? 0.78 : 0.62) / mediaPlane.scale.x,
        visibleHeight * (mobile ? 0.54 : 0.5) / mediaPlane.scale.y,
      );
      mediaRoot.scale.setScalar(mediaScale * lerp(0.86, 1, phaseBlend) * scrollMediaExpansion);
      mediaMaterial.opacity = phase === 'evidence' ? 1 : phaseBlend;
      edgeGlowMaterial.opacity = phaseBlend * 0.15;
      // A texture is never placed behind structural glass: the source remains readable.
    }
    scene.updateMatrixWorld();
    updateProjection();
    try {
      renderer.render(scene, camera);
      if (!ready) { ready = true; onReady?.(); }
    } catch (error) {
      lastError = error.message; onError?.(error); return;
    }
    canvas.dataset.rotation = `${rotation.x.toFixed(3)},${rotation.y.toFixed(3)}`;
    canvas.dataset.phase = phase;
    canvas.dataset.route = routeIds.join(',');
    canvas.dataset.selected = selectedId || '';
    canvas.dataset.mediaType = mediaType || '';
    canvas.dataset.active = String(active);
    canvas.dataset.scrollRenderedProgress = scrollRenderedProgress.toFixed(3);
    canvas.dataset.scrollRouteReveal = scrollRouteReveal.toFixed(3);
    canvas.dataset.scrollMediaExpansion = scrollMediaExpansion.toFixed(3);
    canvas.dataset.scrollCamera = `${scrollDistance.toFixed(4)},${scrollPitch.toFixed(4)}`;
    scheduleFrame();
  }

  function visibilityChange() {
    if (document.hidden) {
      stopRendering();
      if (mediaType === 'video') mediaElement?.pause();
    } else if (active) resize();
  }
  function contextLoss(event) {
    event.preventDefault(); contextLost = true; ready = false;
    stopRendering();
    if (mediaType === 'video') mediaElement?.pause();
    onError?.(new Error('图形上下文暂时中断，请恢复窗口或刷新重试。'));
  }
  function contextRestore() { contextLost = false; ready = false; resize(); }
  canvas.addEventListener('webglcontextlost', contextLoss);
  canvas.addEventListener('webglcontextrestored', contextRestore);
  document.addEventListener('visibilitychange', visibilityChange);
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
  resize();

  const api = {
    setState(next = {}) {
      family = next.family || family; stay = next.stay || stay;
      if (next.accent) { try { accent.set(next.accent); } catch { /* keep established color */ } }
      const nextRoute = [...new Set((next.route || routeIds).filter((id) => nodes.has(id)))];
      for (const [id, node] of nodes) node.target = nextRoute.includes(id) ? 1 : 0.12;
      if (nextRoute.join(',') !== routeIds.join(',')) { routeIds = nextRoute; rebuildRoute(routeIds); }
    },
    setPhase(next) {
      if (['family', 'route', 'evidence'].includes(next)) {
        // An entering evidence chapter already has a readable image at progress 0.
        if (next === 'evidence' && phase !== next) phaseBlend = Math.max(phaseBlend, 0.82);
        phase = next;
      }
      if (phase !== 'evidence' && mediaType === 'video') mediaElement?.pause();
    },
    setScrollProgress({ progress, section = scrollSection } = {}) {
      if (disposed || !Object.hasOwn(SCROLL_SECTIONS, section) || !Number.isFinite(progress)) return;
      const nextProgress = clamp(progress, 0, 1);
      if (section !== scrollSection) scrollRenderedProgress = nextProgress;
      scrollSection = section; scrollProgress = nextProgress;
      canvas.dataset.scrollSection = section; canvas.dataset.scrollProgress = nextProgress.toFixed(3);
      scheduleFrame();
    },
    setSelected(id) { selectedId = nodes.has(id) ? id : null; clearRelationHover(); },
    setMedia(element, type = 'image') {
      if (element && element === mediaElement && type === mediaType) {
        const w = type === 'video' ? element.videoWidth : element.naturalWidth || element.width;
        const h = type === 'video' ? element.videoHeight : element.naturalHeight || element.height;
        mediaAspect = w > 0 && h > 0 ? w / h : mediaAspect;
        fitMedia();
        return;
      }
      if (mediaTexture) { mediaTexture.dispose(); textures.delete(mediaTexture); mediaTexture = null; }
      mediaElement = element || null; mediaType = element ? type : null;
      if (mediaType === 'video' && (!active || document.hidden)) mediaElement.pause();
      if (!element) { mediaMaterial.map = null; mediaMaterial.needsUpdate = true; mediaRoot.visible = false; return; }
      const w = type === 'video' ? element.videoWidth : element.naturalWidth || element.width;
      const h = type === 'video' ? element.videoHeight : element.naturalHeight || element.height;
      mediaAspect = w > 0 && h > 0 ? w / h : 16 / 9;
      mediaTexture = type === 'video' ? new THREE.VideoTexture(element) : new THREE.Texture(element);
      mediaTexture.colorSpace = THREE.SRGBColorSpace;
      mediaTexture.minFilter = THREE.LinearFilter; mediaTexture.magFilter = THREE.LinearFilter;
      mediaTexture.generateMipmaps = false; mediaTexture.needsUpdate = true;
      textures.add(mediaTexture);
      mediaMaterial.map = mediaTexture; mediaMaterial.needsUpdate = true; fitMedia();
    },
    setReducedMotion(value) { reducedMotion = !!value; if (reducedMotion) { velocity.set(0, 0); if (mediaType === 'video') mediaElement?.pause(); } },
    setActive(value) {
      active = !!value;
      canvas.dataset.active = String(active);
      if (!active) {
        stopRendering();
        pointerCancel();
        if (mediaType === 'video') mediaElement?.pause();
        for (let i = activeRoutes.length - 1; i >= 0; i--) {
          if (activeRoutes[i].retiring) { disposeRoute(activeRoutes[i]); activeRoutes.splice(i, 1); }
        }
      } else resize();
    },
    resetView() { rotation.set(0, 0); velocity.set(0, 0); projectionStamp = ''; },
    getStats() {
      return { ready, renderer: 'WebGL2', fps, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures, dpr: renderer.getPixelRatio(),
        family, stay, route: [...routeIds], phase, selected: selectedId, mediaType, reducedMotion,
        rotation: [rotation.x, rotation.y], scrollSection, scrollProgress, scrollRenderedProgress,
        scrollDistance, scrollPitch, scrollRouteReveal, scrollMediaExpansion, gesture: pointerGesture,
        active, hasLayout, routeLayers: activeRoutes.length, running: !!frameId, error: lastError,
        relations: activeRoutes.filter((record) => !record.retiring).flatMap((record) => record.segments.map((segment) => ({
          from: segment.from, to: segment.to, type: segment.type, label: segment.label, color: segment.color,
          selected: segment.from === selectedId || segment.to === selectedId,
          emphasis: +segment.emphasis.toFixed(3), reveal: +segment.uniforms.uReveal.value.toFixed(3),
          start: segment.samples[0].toArray().map((value) => +value.toFixed(3)),
          end: segment.samples[segment.samples.length - 1].toArray().map((value) => +value.toFixed(3)),
        }))),
        hoveredRelation: hoveredRelation ? `${hoveredRelation.from}:${hoveredRelation.to}` : null };
    },
    dispose() {
      if (disposed) return; disposed = true;
      clearRelationHover();
      stopRendering();
      if (mediaType === 'video') mediaElement?.pause();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', visibilityChange);
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointerleave', pointerLeave); canvas.removeEventListener('pointercancel', pointerCancel);
      canvas.removeEventListener('webglcontextlost', contextLoss); canvas.removeEventListener('webglcontextrestored', contextRestore);
      for (const record of activeRoutes) disposeRoute(record);
      for (const geometry of geometries) geometry.dispose();
      for (const surface of materials) surface.dispose();
      for (const texture of textures) texture.dispose();
      environmentTarget.dispose(); renderer.dispose();
    },
  };
  api.setState({ family: 'school', stay: 'day', route: ['water', 'reel', 'dining'] });
  scheduleFrame();
  return api;
}
