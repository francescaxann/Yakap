'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type Butterfly = { id: number; x: number; y: number; drift: number }

const LIFETIME_MS = 1800
const MAX_BUTTERFLIES = 12

function ButterflyIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 animate-butterfly-fly" aria-hidden="true" focusable="false">
      <g className="origin-right animate-butterfly-flap [transform-box:fill-box]">
        <path d="M16 15 C10 3 1 4 3 12 C4 17 9 18 16 16 C10 18 6 22 9 27 C12 30 15 23 16 18 Z" fill="#4aa3e8" />
        <path d="M13 14 C9 8 5 8 6 12 C7 14 10 15 13 14 Z" fill="#a9d8f8" />
      </g>
      <g className="origin-left animate-butterfly-flap [transform-box:fill-box]">
        <path d="M16 15 C22 3 31 4 29 12 C28 17 23 18 16 16 C22 18 26 22 23 27 C20 30 17 23 16 18 Z" fill="#4aa3e8" />
        <path d="M19 14 C23 8 27 8 26 12 C25 14 22 15 19 14 Z" fill="#a9d8f8" />
      </g>
      <rect x="15.2" y="10" width="1.6" height="14" rx=".8" fill="#17608f" />
    </svg>
  )
}

export function ClickButterflies() {
  const [butterflies, setButterflies] = useState<Butterfly[]>([])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timers = new Set<number>()
    let nextId = 0

    const release = (event: MouseEvent) => {
      if (reducedMotion.matches) return
      // A keyboard-activated click has no pointer position, so use the centre of the control.
      const rect = event.detail === 0 && event.target instanceof Element ? event.target.getBoundingClientRect() : null
      const x = rect ? rect.left + rect.width / 2 : event.clientX
      const y = rect ? rect.top + rect.height / 2 : event.clientY
      const id = nextId++
      const drift = (Math.random() - 0.5) * 120

      setButterflies((current) => [...current.slice(-(MAX_BUTTERFLIES - 1)), { id, x, y, drift }])
      timers.add(window.setTimeout(() => setButterflies((current) => current.filter((item) => item.id !== id)), LIFETIME_MS))
    }

    document.addEventListener('click', release)
    return () => {
      document.removeEventListener('click', release)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {butterflies.map(({ id, x, y, drift }) => (
        <span key={id} className="absolute -ml-4 -mt-4" style={{ left: x, top: y, '--butterfly-drift': `${drift}px` } as CSSProperties}>
          <ButterflyIcon />
        </span>
      ))}
    </div>
  )
}
