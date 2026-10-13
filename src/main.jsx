import React from 'react'
import { createRoot } from 'react-dom/client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'
import './index.css'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
// StrictMode is intentionally omitted: it double-mounts the WebGL canvases and pinned triggers in dev.
createRoot(document.getElementById('root')).render(<App />)
