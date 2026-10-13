import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LABELS, EDGES, ll, isLand, arc } from '../lib/geo'

/** Interactive dotted globe: drag to rotate, labelled country nodes, animated blue→orange network arcs. */
export default function Globe({ className = '' }) {
  const host = useRef(null)
  useEffect(() => {
    const el = host.current, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); el.appendChild(renderer.domElement)
    const cv = renderer.domElement; cv.style.cssText = 'width:100%;height:100%;touch-action:pan-y;cursor:grab;position:absolute;inset:0'
    const labelsEl = document.createElement('div'); labelsEl.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden'; el.appendChild(labelsEl)

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50), g = new THREE.Group(); scene.add(g)
    g.rotation.y = ((90 - (22 + 180)) * Math.PI) / 180; g.rotation.x = 0.4

    // lit sphere (fixed light: lower-right blue glow, orange rim)
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.99, 64, 64), new THREE.ShaderMaterial({
      vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 n;void main(){vec3 L=normalize(vec3(.5,-.6,.65));float d=max(dot(n,L),0.);float rim=pow(1.-max(n.z,0.),3.);vec3 c=vec3(.015,.02,.04)+vec3(.05,.22,1.)*pow(d,2.4)*1.1+vec3(1.,.38,.1)*rim*.55;gl_FragColor=vec4(c,1.);}'
    })))
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 64), new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      vertexShader: 'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec3 n;void main(){float i=pow(max(0.,.64-dot(n,vec3(0.,0.,1.))),3.);gl_FragColor=vec4(1.,.4,.12,1.)*i*1.5;}'
    })))

    const pts = [], N = 24000
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996323, x = Math.cos(th) * r, z = Math.sin(th) * r
      const lat = (Math.asin(y) * 180) / Math.PI, lon = ((((Math.atan2(z, -x) * 180) / Math.PI - 180) + 540) % 360) - 180
      if (isLand(lat, lon)) pts.push(x, y, z)
    }
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    g.add(new THREE.Points(dg, new THREE.PointsMaterial({ size: 0.0105, color: 0xffffff, transparent: true, opacity: 0.85 })))

    // network arcs with blue → orange gradient
    const c0 = new THREE.Color(0x2a5bff), c1 = new THREE.Color(0xff5b1f)
    const arcs = EDGES.map(([a, b], i) => {
      const p = arc(LABELS[a].slice(1), LABELS[b].slice(1), 0.55), col = []
      p.forEach((_, k) => { const c = c0.clone().lerp(c1, k / (p.length - 1)); col.push(c.r, c.g, c.b) })
      const geo = new THREE.BufferGeometry().setFromPoints(p); geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
      const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true }); g.add(new THREE.Line(geo, mat))
      return { geo, mat, n: p.length, off: i * 0.37 }
    })
    const nodes = LABELS.map(([, la, lo]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), new THREE.MeshBasicMaterial({ color: 0xff5b1f })); m.position.copy(ll(la, lo, 1.004)); g.add(m); return m })
    const tags = LABELS.map(([n]) => { const d = document.createElement('div'); d.textContent = n; d.style.cssText = 'position:absolute;left:0;top:0;background:#000;color:#fff;font:700 10px "Space Mono",monospace;text-transform:uppercase;padding:4px 8px;white-space:nowrap'; labelsEl.appendChild(d); return d })

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h
      cam.position.z = 2 / (0.63 * 0.84 * Math.min(1, cam.aspect)); cam.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize); ro.observe(el); resize()

    let drag = false, lx = 0, ly = 0, vx = 0
    const down = (e) => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing' }
    const move = (e) => { if (!drag) return; vx = (e.clientX - lx) * 0.005; g.rotation.y += vx; g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + (e.clientY - ly) * 0.003, -0.9, 0.9); lx = e.clientX; ly = e.clientY }
    const up = () => { drag = false; cv.style.cursor = 'grab' }
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up)

    const clock = new THREE.Clock(), v = new THREE.Vector3(); let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime
      if (!drag) { vx *= 0.95; g.rotation.y += vx + (reduce ? 0 : dt * 0.06) }
      arcs.forEach((a) => { const k = ((t * 0.22 + a.off) % 1.6); a.geo.setDrawRange(0, Math.floor(Math.min(1, k / 0.9) * a.n)); a.mat.opacity = k < 1.1 ? 1 : Math.max(0, 1 - (k - 1.1) / 0.5) })
      nodes.forEach((n, i) => n.scale.setScalar(1 + 0.5 * Math.sin(t * 2 + i)))
      g.updateMatrixWorld(); const w = el.clientWidth, h = el.clientHeight
      nodes.forEach((n, i) => {
        n.getWorldPosition(v); const facing = v.clone().normalize().dot(cam.position.clone().sub(v).normalize()) > 0.25
        v.project(cam); tags[i].style.opacity = facing ? 1 : 0
        tags[i].style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px,${(-v.y * 0.5 + 0.5) * h}px) translate(-50%,-150%)`
      })
      renderer.render(scene, cam)
    }
    loop()
    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      scene.traverse((o) => { o.geometry?.dispose(); const m = o.material; m && (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose()) })
      renderer.dispose(); cv.remove(); labelsEl.remove()
    }
  }, [])
  return <div ref={host} className={`relative ${className}`} />
}
