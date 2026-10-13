import * as THREE from 'three'

const { lerp, clamp, degToRad } = THREE.MathUtils
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const mix = (k, x) => { if (x <= k[0][0]) return k[0][1]; for (let i = 1; i < k.length; i++) if (x <= k[i][0]) return lerp(k[i - 1][1], k[i][1], sm(k[i - 1][0], k[i][0], x)); return k[k.length - 1][1] }
const mat = (c, r = 0.7, m = 0.25, e) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...(e ? { emissive: e } : {}) })
const box = (w, h, d, c, r, m, e) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c, r, m, e))
const L = 12, H = 2.8, W = 2.6

/** MASTER TIMELINE — scroll progress p (0..1). Every vehicle/camera value below derives from this. */
export const T = { lift: [0.02, 0.13], retreat: [0.13, 0.17], drive: [0.17, 0.56], h1: [0.56, 0.62], sail: [0.62, 0.82], planeIn: 0.84, h2: [0.91, 0.935] }

// Road path: straight east → quarter-turn (R=30) → straight south to the port.
const R = 30, ARC = (Math.PI / 2) * R, S0 = 142, S1 = 350 + ARC + 176
function pathAt(s, o) {
  if (s < 350) { o.x = -150 + s; o.z = 0; o.hx = 1; o.hz = 0 }
  else if (s < 350 + ARC) { const a = (s - 350) / R; o.x = 200 + R * Math.sin(a); o.z = R - R * Math.cos(a); o.hx = Math.cos(a); o.hz = Math.sin(a) }
  else { o.x = 230; o.z = R + (s - 350 - ARC); o.hx = 0; o.hz = 1 }
  return o
}
const PORT_X = 230, SHIP_Z0 = 260, SHIP_Z1 = 700, PLANE_Y = 230

// camera keys
const PHI = [[0, 3], [0.22, 3], [0.3, 36], [0.355, 90], [1, 90]]
const DIST = [[0, 70], [0.17, 66], [0.24, 50], [0.33, 68], [0.37, 115], [0.52, 120], [0.6, 125], [0.64, 150], [0.76, 150], [0.84, 330], [0.96, 330], [1, 270]]
const SHIFT = [[0, 0], [0.2, 0], [0.26, 0.2], [0.33, 0.2], [0.38, 0], [1, 0]]
const BG = [[0, 0xf4f4f2], [0.22, 0xf4f4f2], [0.265, 0x0b0b0d], [0.325, 0x0b0b0d], [0.355, 0xf4f4f2], [1, 0xf4f4f2]]
const c1 = new THREE.Color(), c2 = new THREE.Color()
const bgAt = (p) => { for (let i = 1; i < BG.length; i++) if (p <= BG[i][0]) return c1.set(BG[i - 1][1]).lerp(c2.set(BG[i][1]), sm(BG[i - 1][0], BG[i][0], p)); return c1.set(BG[BG.length - 1][1]) }

function ribTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128
  const x = c.getContext('2d'); x.fillStyle = '#c4c4c4'; x.fillRect(0, 0, 512, 128)
  for (let i = 0; i < 64; i++) { x.fillStyle = i % 2 ? '#aeaeae' : '#dadada'; x.fillRect(i * 8, 0, 5, 128) }
  x.fillStyle = 'rgba(0,0,0,.5)'; x.font = 'bold 15px monospace'; x.fillText('NBND 482916 7 · PLACEHOLDER', 22, 112)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t
}
function cloudTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d')
  for (let i = 0; i < 26; i++) {
    const px = 40 + Math.random() * 176, py = 40 + Math.random() * 176, r = 24 + Math.random() * 40, g = x.createRadialGradient(px, py, 0, px, py, r)
    g.addColorStop(0, 'rgba(240,242,252,.55)'); g.addColorStop(1, 'rgba(240,242,252,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
function wakeTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 32; const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 256, 0)
  g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 32)
  const v = x.createLinearGradient(0, 0, 0, 32); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)')
  x.globalCompositeOperation = 'destination-out'; x.fillStyle = v; x.fillRect(0, 0, 256, 32); return new THREE.CanvasTexture(c)
}

function ribbon(w, sMax) {
  const pos = [], idx = [], o = {}; let n = 0
  for (let s = 0; s <= sMax; s += 2) {
    pathAt(s, o); const nx = -o.hz, nz = o.hx
    pos.push(o.x + (nx * w) / 2, 0.02, o.z + (nz * w) / 2, o.x - (nx * w) / 2, 0.02, o.z - (nz * w) / 2)
    if (n) { const i = n * 2; idx.push(i - 2, i - 1, i, i - 1, i + 1, i) } n++
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g
}

function makeTruck() {
  const g = new THREE.Group(), wheels = []
  const deck = box(13, 0.35, 2.7, 0x1a1d22); deck.position.y = 1.3; g.add(deck)
  const cab = box(3.2, 3, 2.7, 0x16181c, 0.5, 0.5); cab.position.set(8, 2.5, 0); g.add(cab)
  const roof = box(2.6, 0.9, 2.5, 0x1d2025, 0.5, 0.5); roof.position.set(7.9, 4.3, 0); g.add(roof)
  const glass = box(0.1, 1.3, 2.3, 0x9ec5ff, 0.1, 0.9, 0x1a2a44); glass.position.set(9.62, 3.2, 0); g.add(glass)
  for (const z of [-0.9, 0.9]) { const l = box(0.1, 0.3, 0.4, 0xfff2cc, 0.3, 0, 0xfff2cc); l.position.set(9.62, 1.7, z); g.add(l) }
  const wg = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 20).rotateX(Math.PI / 2)
  for (const x of [-5, -3.8, -2.6, 7.8]) for (const z of [-1.3, 1.3]) { const w = new THREE.Mesh(wg, mat(0x0b0b0c, 0.9, 0)); w.position.set(x, 0.55, z); g.add(w); wheels.push(w) }
  const slot = new THREE.Object3D(); slot.position.set(0, 1.475 + H / 2, 0); g.add(slot)
  g.userData = { slot, wheels }; return g
}

function makeCrane() {
  const g = new THREE.Group(), teal = 0x1d9bb8, navy = 0x1b2433
  const parts = [[box(10, 2, 3.6, navy, 0.6, 0.4), 3, 2, 0], [box(3, 3, 3, teal, 0.5, 0.3), -1.8, 4.2, 0], [box(0.1, 1.4, 2.4, 0x0b1626, 0.2, 0.8, 0x0e2a4a), -3.35, 4.6, 0], [box(3.5, 3, 3.4, teal), 6.5, 3.5, 0]]
  parts.forEach(([m, x, y, z]) => { m.position.set(x, y, z); g.add(m) })
  const wg = new THREE.CylinderGeometry(1.3, 1.3, 0.9, 20).rotateX(Math.PI / 2)
  for (const x of [-1.5, 6]) for (const z of [-1.9, 1.9]) { const w = new THREE.Mesh(wg, mat(0x0b0b0c, 0.9, 0)); w.position.set(x, 1.3, z); g.add(w) }
  const boom = new THREE.Group(); boom.position.set(0, 3.6, 0); const bm = box(16, 1.2, 1.6, navy, 0.6, 0.4); bm.position.x = 8; boom.add(bm); g.add(boom)
  const link = box(0.5, 1, 0.5, 0x888888), spreader = box(12.6, 0.35, 2.6, 0x222a36)
  for (const x of [-6.2, 6.2]) { const y = box(0.5, 0.4, 2.7, 0xf2c200); y.position.x = x; spreader.add(y) }
  g.add(link, spreader); g.userData = { boom, link, spreader }; return g
}

function makeShip(makeBox) {
  const outer = new THREE.Group(), inner = new THREE.Group(); outer.add(inner)
  const sh = new THREE.Shape(); sh.moveTo(-35, -7.75); sh.lineTo(20, -7.75); sh.lineTo(35, -3.5); sh.lineTo(39, 0); sh.lineTo(35, 3.5); sh.lineTo(20, 7.75); sh.lineTo(-35, 7.75); sh.closePath()
  const hullG = new THREE.ExtrudeGeometry(sh, { depth: 4, bevelEnabled: false }).rotateX(-Math.PI / 2); hullG.translate(0, -2, 0)
  inner.add(new THREE.Mesh(hullG, mat(0x1d6fa5, 0.6, 0.3)))
  const bridge = box(6, 8, 13, 0xe8e8e4, 0.6, 0.2); bridge.position.set(-31, 6, 0); inner.add(bridge)
  const win = box(6.1, 1, 12, 0x0b1626, 0.2, 0.8, 0x0e2a4a); win.position.set(-31, 8.4, 0); inner.add(win)
  const fun = box(3, 5, 3, 0xff5b1f); fun.position.set(-31, 11, 0); inner.add(fun)
  const cols = [0x2323a8, 0xe83e8c, 0xe8e8e8, 0xff5b1f, 0xe0b24a, 0xd62828, 0x2f80ed]; let n = 0
  for (let b = 0; b < 4; b++) for (let r = -2; r <= 2; r++) for (const layer of [0, 1]) {
    if (b === 0 && r === 0) continue
    const c = makeBox(cols[(n++ * 3) % cols.length]); c.position.set(-22 + b * 13, 3.4 + layer * (H + 0.02), r * 2.9); inner.add(c)
  }
  const slot = new THREE.Object3D(); slot.position.set(-22, 3.4, 0); inner.add(slot)
  const wt = wakeTexture(), wm = new THREE.MeshBasicMaterial({ map: wt, transparent: true, depthWrite: false, opacity: 0 })
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(110, 7).rotateX(-Math.PI / 2), wm); w.position.set(-35 - 52, 0.3, s * 11); w.rotation.y = -s * 0.2; outer.add(w) }
  const core = new THREE.Mesh(new THREE.PlaneGeometry(110, 9).rotateX(-Math.PI / 2), wm); core.position.set(-90, 0.32, 0); outer.add(core)
  outer.userData = { inner, slot, wm }; return outer
}

function makePlane() {
  const g = new THREE.Group(), body = mat(0xf6f6f8, 0.4, 0.2), wingM = mat(0xdcdde4, 0.5, 0.2), dark = mat(0x2b2f36, 0.6, 0.4)
  const f = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 34, 24).rotateZ(Math.PI / 2), body); f.position.y = 5.5; g.add(f)
  const nose = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 16), body); nose.scale.set(2.2, 1, 1); nose.position.set(17, 5.5, 0); g.add(nose)
  const tail = new THREE.Mesh(new THREE.ConeGeometry(2.4, 12, 24).rotateZ(Math.PI / 2), body); tail.position.set(-23, 6, 0); g.add(tail)
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 21), wingM); w.position.set(2 - 3, 5, s * 12); w.rotation.y = s * 0.45; g.add(w)
    const tip = new THREE.Mesh(new THREE.BoxGeometry(2, 0.55, 3), mat(0xd62828)); tip.position.set(-7.4, 5, s * 21.5); tip.rotation.y = s * 0.45; g.add(tip)
    const st = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 7), wingM); st.position.set(-20, 6, s * 4.5); g.add(st)
    for (const z of [8, 15]) { const e = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4.5, 16).rotateZ(Math.PI / 2), dark); e.position.set(2 - z * 0.45 - 3, 3.8, s * z); g.add(e) }
  }
  const fin = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 0.5), mat(0xd62828)); fin.position.set(-20, 9, 0); g.add(fin)
  const slot = new THREE.Object3D(); slot.position.set(0, 2.6, 0); g.add(slot)
  g.userData = { slot }; return g
}

export function createJourney(canvas, state, onFrame) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setClearColor(0x000000, 0)
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 1, 4000)

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9aa6, 1.25))
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 220 }); sun.shadow.bias = -0.0004; scene.add(sun, sun.target)

  const tex = ribTexture(), matCache = {}
  const makeBox = (color) => { const m = (matCache[color] ||= new THREE.MeshStandardMaterial({ color, map: tex, roughness: 0.55, metalness: 0.3 })); return new THREE.Mesh(cGeo, m) }
  const cGeo = new THREE.BoxGeometry(L, H, W)
  const hero = makeBox(0xf2f2f2); hero.castShadow = true; scene.add(hero)
  const hold = new THREE.LineSegments(new THREE.EdgesGeometry(cGeo), new THREE.LineBasicMaterial({ color: 0xff5b1f, depthTest: false, transparent: true })); hold.renderOrder = 20; hold.visible = false; hero.add(hold)

  // land: shadow catcher, road, dashes, branch road, quay
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(500, 300).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.2 })); shadowPlane.position.y = 0.1; shadowPlane.receiveShadow = true; scene.add(shadowPlane)
  const roadM = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.95, metalness: 0, side: THREE.DoubleSide })
  scene.add(new THREE.Mesh(ribbon(9, S1 + 16), roadM))
  const branch = box(180, 0.04, 9, 0x141416, 0.95, 0); branch.position.set(320, 0.02, R); scene.add(branch)
  const dMat = new THREE.MeshBasicMaterial({ color: 0xd2d2d2 }), nD = 90, dashes = new THREE.InstancedMesh(new THREE.BoxGeometry(4, 0.05, 0.28), dMat, nD + 24), dm = new THREE.Object3D(), po = {}
  for (let i = 0; i < nD; i++) { pathAt(i * 7, po); dm.position.set(po.x, 0.07, po.z); dm.rotation.y = -Math.atan2(po.hz, po.hx); dm.updateMatrix(); dashes.setMatrixAt(i, dm.matrix) }
  for (let i = 0; i < 24; i++) { dm.position.set(240 + i * 7, 0.07, R); dm.rotation.y = 0; dm.updateMatrix(); dashes.setMatrixAt(nD + i, dm.matrix) }
  scene.add(dashes)
  const quay = box(90, 0.4, 4, 0x8d8d92, 0.8, 0.1); quay.position.set(PORT_X, 0.2, 222); scene.add(quay)

  // yard props: container stack, crane, truck
  const stack = [[0x2323a8, 30, 1.4], [0xff5b1f, 43, 1.4], [0xe8e8e8, 30, 4.22]]
  stack.forEach(([c, x, y]) => { const m = makeBox(c); m.position.set(x, y, -19); m.castShadow = true; scene.add(m) })
  const crane = makeCrane(), truck = makeTruck(); crane.traverse((o) => (o.castShadow = true)); truck.traverse((o) => (o.castShadow = true)); scene.add(crane, truck)

  // ocean (shader, world-space waves, clipped at the quay)
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uHaze: { value: 0 } },
    vertexShader: 'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
    fragmentShader: `uniform float uT,uHaze;varying vec3 vW;
      float h(vec2 p){return sin(p.x*.08+uT*.6)*.5+sin(p.y*.11-uT*.8+p.x*.05)*.5+sin((p.x+p.y)*.2+uT*1.3)*.25;}
      void main(){ if(vW.z<224.) discard; vec2 p=vW.xz; p+=vec2(sin(p.y*.05+uT*.3),cos(p.x*.04-uT*.2))*6.;
        float w=h(p)+h(p*2.1+13.)*.5; vec3 deep=vec3(.015,.1,.42),mid=vec3(.05,.3,.78),hi=vec3(.6,.8,1.);
        vec3 c=mix(deep,mid,smoothstep(-.9,1.2,w)); c+=hi*smoothstep(1.3,1.9,w)*.5;
        c=mix(c,vec3(.55,.55,.82),uHaze*.7); gl_FragColor=vec4(c,1.);}`
  })); scene.add(ocean)
  const ship = makeShip(makeBox); ship.rotation.y = -Math.PI / 2; scene.add(ship)

  // clouds: ship corridor stays open until ~z760, then dense cover
  const cm = new THREE.MeshBasicMaterial({ map: cloudTexture(), transparent: true, depthWrite: false, opacity: 0.92, fog: false }), cg = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
  const clouds = new THREE.Group(); scene.add(clouds)
  for (let i = 0; i < 170; i++) {
    const dense = i > 60, z = dense ? 560 + Math.random() * 300 : 480 + Math.random() * 300
    let x = dense ? 300 + Math.random() * 1100 : PORT_X + (Math.random() < 0.5 ? -1 : 1) * (95 + Math.random() * 260)
    if (!dense && z > 760) x = PORT_X + (Math.random() - 0.5) * 500
    const m = new THREE.Mesh(cg, cm), s = 110 + Math.random() * 170; m.scale.set(s, 1, s * (0.7 + Math.random() * 0.5)); m.position.set(x, 55 + Math.random() * 55, z); m.rotation.y = Math.random() * 6.28; clouds.add(m)
  }
  const plane = makePlane(); plane.position.y = PLANE_Y; plane.visible = false; scene.add(plane)

  // runtime state
  const o = {}, pp = {}, cp = new THREE.Vector3(), cq = new THREE.Quaternion(), tmp = { a: new THREE.Vector3(), b: new THREE.Vector3(), qa: new THREE.Quaternion(), qb: new THREE.Quaternion() }
  const focus = new THREE.Vector3(0, 1.5, 0), want = new THREE.Vector3(); let phiD = 3, dD = 70, shD = 0, first = true, W0 = 1, H0 = 1
  let pd = 0, raf, speed = 0, last = { s: S0, z: SHIP_Z0, x: -210 }

  const resize = () => { const pr = canvas.parentElement; W0 = pr.clientWidth; H0 = pr.clientHeight; renderer.setSize(W0, H0, false); cam.aspect = W0 / H0; cam.fov = cam.aspect < 1 ? 44 : 30; cam.updateProjectionMatrix() }
  const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement); resize()

  const clock = new THREE.Clock(); let tick = 0
  const frame = () => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
    pd += (state.p - pd) * Math.min(1, dt * 6); const p = pd

    // --- crane choreography (u = lift progress) ---
    const u = clamp((p - T.lift[0]) / (T.lift[1] - T.lift[0]), 0, 1), r = sm(...T.retreat, p)
    const th0 = degToRad(mix([[0, 0.716], [0.2, 0.716], [0.4, 30], [0.75, 30], [0.95, 6.01], [1, 6.01]], u))
    const th = lerp(th0, degToRad(0.716), r), px = lerp(mix([[0, 24], [0.4, 24], [0.75, 7.912], [1, 7.912]], u), 50, r), pz = lerp(0, -12, r)
    crane.position.set(px, 0, pz); crane.userData.boom.rotation.z = Math.PI - th
    const tipX = -16 * Math.cos(th), tipY = 3.6 + 16 * Math.sin(th)
    crane.userData.link.position.set(tipX, tipY - 0.5, 0); crane.userData.spreader.position.set(tipX, tipY - 0.82, 0)

    // --- truck follows the road path ---
    const tt = clamp((p - T.drive[0]) / (T.drive[1] - T.drive[0]), 0, 1), e = 0.5 * tt + 0.5 * tt * tt * (3 - 2 * tt), s = lerp(S0, S1, e)
    pathAt(s, pp); truck.position.set(pp.x, 0, pp.z); truck.rotation.y = -Math.atan2(pp.hz, pp.hx)
    truck.userData.wheels.forEach((w) => (w.rotation.z = -(s - S0) / 0.55))

    // --- ship ---
    const shipZ = lerp(SHIP_Z0, SHIP_Z1, sm(...T.sail, p)); ship.position.set(PORT_X, 0, shipZ)
    ship.userData.inner.position.y = Math.sin(t * 1.2) * 0.12; ship.userData.inner.rotation.x = Math.sin(t * 0.9) * 0.012; ship.userData.inner.rotation.z = Math.sin(t * 0.7) * 0.01
    ship.userData.wm.opacity = sm(T.sail[0], T.sail[0] + 0.03, p) * (1 - sm(0.8, 0.84, p)) * 0.8
    ocean.material.uniforms.uT.value = t; ocean.material.uniforms.uHaze.value = sm(0.74, 0.9, p)
    ocean.position.set(focus.x, 0, focus.z)

    // --- plane ---
    let plx = -210
    if (p >= T.planeIn) plx = p < T.h2[0] ? lerp(-210, 200, 1 - Math.pow(1 - sm(T.planeIn, T.h2[0], p), 2)) : p < T.h2[1] ? lerp(200, 260, sm(...T.h2, p)) : lerp(260, 900, Math.pow(sm(T.h2[1], 1, p), 2))
    plane.position.set(plx, PLANE_Y, SHIP_Z1); plane.visible = p > T.planeIn - 0.01

    scene.updateMatrixWorld(true)

    // --- THE container: always bound to exactly one carrier slot, arcing between slots during lifts ---
    let sc = 1
    const slotT = truck.userData.slot, slotS = ship.userData.slot, slotP = plane.userData.slot
    const getP = (sl, v, q) => { sl.getWorldPosition(v); sl.getWorldQuaternion(q) }
    if (p < T.lift[1]) { cp.set(px + tipX, tipY - 1 - H / 2, pz); cq.identity() }
    else if (p < T.h1[0]) getP(slotT, cp, cq)
    else if (p < T.h1[1]) { const k = sm(...T.h1, p); getP(slotT, tmp.a, tmp.qa); getP(slotS, tmp.b, tmp.qb); cp.lerpVectors(tmp.a, tmp.b, k); cp.y += Math.sin(Math.PI * k) * 18; cq.slerpQuaternions(tmp.qa, tmp.qb, k) }
    else if (p < T.h2[0]) getP(slotS, cp, cq)
    else if (p < T.h2[1]) { const k = sm(...T.h2, p); getP(slotS, tmp.a, tmp.qa); getP(slotP, tmp.b, tmp.qb); cp.lerpVectors(tmp.a, tmp.b, k); cq.slerpQuaternions(tmp.qa, tmp.qb, k); sc = lerp(1, 0.55, k) }
    else { getP(slotP, cp, cq); sc = 0.55 }
    hero.position.copy(cp); hero.quaternion.copy(cq); hero.scale.setScalar(sc); hold.visible = p > T.h2[0] + 0.01

    // --- camera rig (pitch side→top, distance, screen offset), all damped ---
    const k = 1 - Math.exp(-dt * 5), m = cam.aspect < 1 ? 1.5 : 1
    phiD += (mix(PHI, p) - phiD) * k; dD += (mix(DIST, p) * m - dD) * k; shD += (mix(SHIFT, p) - shD) * k
    if (p < T.drive[0] - 0.02) want.set(0, 1.8, 0)
    else if (p < T.h1[0]) want.set(lerp(0, truck.position.x, sm(0.15, 0.2, p)), 1.5, lerp(0, truck.position.z, sm(0.15, 0.2, p)))
    else want.set(cp.x, 0, cp.z)
    if (first) { focus.copy(want); phiD = mix(PHI, p); dD = mix(DIST, p) * m; first = false } else focus.lerp(want, k)
    const ph = degToRad(phiD)
    cam.position.set(focus.x, focus.y + dD * Math.sin(ph), focus.z + dD * Math.cos(ph)); cam.up.set(0, Math.cos(ph), -Math.sin(ph)); cam.lookAt(focus)
    cam.setViewOffset(W0, H0, 0, shD * H0, W0, H0)
    sun.position.set(focus.x - 30, 70, focus.z + 35); sun.target.position.copy(focus); sun.castShadow = p < 0.6; shadowPlane.position.set(focus.x, 0.1, focus.z)

    // --- HUD info ---
    const mode = p < 0.17 ? 'idle' : p < T.h1[1] ? 'road' : p < T.planeIn ? 'ocean' : 'air'
    const raw = mode === 'road' ? clamp((Math.abs(s - last.s) / dt) * 0.6, 0, 90) : mode === 'ocean' ? clamp((Math.abs(shipZ - last.z) / dt) * 0.12, 0, 32) : mode === 'air' ? clamp((Math.abs(plx - last.x) / dt) * 0.9, 0, 920) : 0
    speed += (raw - speed) * Math.min(1, dt * 4); last = { s, z: shipZ, x: plx }

    renderer.render(scene, cam)
    if ((tick++ & 1) === 0 && onFrame) onFrame(p, { mode, speed, bg: '#' + bgAt(p).getHexString() })
  }
  frame()

  return {
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect()
      scene.traverse((x) => { x.geometry?.dispose(); const mm = x.material; mm && (Array.isArray(mm) ? mm : [mm]).forEach((y) => { y.map?.dispose?.(); y.dispose() }) })
      tex.dispose(); renderer.dispose()
    }
  }
}
