import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraIntro } from '../config/devices'
import { qualitySettings } from '../config/quality'
import { useAppStore } from '../store/useAppStore'
import { Scene } from './Scene'

export function SceneCanvas() {
  const quality = useAppStore((state) => state.quality)
  const dpr = qualitySettings[quality].dpr

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: cameraIntro.position, fov: 32, near: 0.08, far: 40 }}
      gl={{
        antialias: false,
        alpha: false,
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        powerPreference: 'high-performance',
      }}
      onPointerMissed={() => useAppStore.getState().selectDevice(null)}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
