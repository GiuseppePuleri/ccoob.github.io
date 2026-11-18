import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../../config/theme'
import { useAppStore } from '../../store/useAppStore'

export function Lighting() {
  const alarm = useRef<THREE.PointLight>(null)

  useFrame((_, delta) => {
    const light = alarm.current
    if (!light) return
    const phase = useAppStore.getState().alarmPhase
    const on = phase === 'drifting' || phase === 'sms' || phase === 'call'
    const target = on ? 7 : 0
    light.intensity = THREE.MathUtils.damp(light.intensity, target, 2.4, delta)
  })

  return (
    <>
      <hemisphereLight args={['#e4eef8', '#221910', 0.28]} />
      <directionalLight
        position={[4.2, 6.4, 3.4]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00018}
        shadow-camera-left={-3.2}
        shadow-camera-right={3.2}
        shadow-camera-top={3.2}
        shadow-camera-bottom={-3.2}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
      />
      <directionalLight position={[-4.2, 2.4, -2]} intensity={0.7} color="#c9d8ea" />
      <directionalLight position={[1.5, 2.2, 4.5]} intensity={1.6} color="#f7f4ef" />
      <pointLight
        ref={alarm}
        position={[-0.55, 1.1, 0.02]}
        color={palette.alarm}
        intensity={0}
        distance={2.2}
        decay={2}
      />
    </>
  )
}
