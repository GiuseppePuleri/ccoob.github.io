import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { startDirector } from './simulation/director'
import { useAppStore } from './store/useAppStore'
import { isAccessGranted } from './ui/auth/access'
import { PasswordGate } from './ui/auth/PasswordGate'
import { Intro } from './ui/loader/Intro'
import { WebglFallback } from './ui/loader/WebglFallback'
import { Overlay } from './ui/layout/Overlay'

const SceneCanvas = lazy(() => import('./scene/SceneCanvas').then((module) => ({ default: module.SceneCanvas })))

class SceneBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null }

  static getDerivedStateFromError(error: Error) {
    return { message: error.message }
  }

  render() {
    if (this.state.message) {
      return (
        <div className="xo-fallback">
          <p className="xo-kicker">Scena</p>
          <h1>Errore di rendering</h1>
          <p>{this.state.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function App() {
  const [unlocked, setUnlocked] = useState(isAccessGranted)
  const [webgl] = useState(supportsWebGL)

  useEffect(() => {
    if (!unlocked) return
    startDirector()
  }, [unlocked])

  useEffect(() => {
    if (!unlocked) return
    if (useAppStore.getState().appPhase === 'explore') return
    const id = window.setTimeout(() => useAppStore.getState().finishIntro(), 2800)
    return () => window.clearTimeout(id)
  }, [unlocked])

  if (!unlocked) {
    return (
      <div className="xo-app">
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      </div>
    )
  }

  return (
    <div className="xo-app">
      {webgl ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <SceneCanvas />
          </Suspense>
        </SceneBoundary>
      ) : (
        <WebglFallback />
      )}
      <Overlay />
      <Intro onEnter={() => useAppStore.getState().finishIntro()} />
    </div>
  )
}
