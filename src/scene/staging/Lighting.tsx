import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../../config/theme'
import { stage } from '../../config/devices'
import { isAlerting } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'

function AimedSpot({
  position,
  aim,
  intensity,
  angle = 0.42,
}: {
  position: [number, number, number]
  aim: [number, number, number]
  intensity: number
  angle?: number
}) {
  const light = useRef<THREE.SpotLight>(null)
  const target = useRef<THREE.Object3D>(null)

  useLayoutEffect(() => {
    if (light.current && target.current) light.current.target = target.current
  }, [])

  return (
    <>
      <spotLight
        ref={light}
        position={position}
        angle={angle}
        penumbra={0.72}
        intensity={intensity}
        decay={2}
        distance={9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
      <object3D ref={target} position={aim} />
    </>
  )
}

export function Lighting() {
  const alarm = useRef<THREE.PointLight>(null)

  useFrame((_, delta) => {
    const light = alarm.current
    if (!light) return
    const target = isAlerting(useAppStore.getState().alarmPhase) ? 7 : 0
    light.intensity = THREE.MathUtils.damp(light.intensity, target, 2.4, delta)
  })

  const table: [number, number, number] = [stage.shelf[0], stage.shelf[1], stage.shelf[2]]
  const fridge: [number, number, number] = [stage.fridge[0], 0.9, 0.1]

  return (
    <>
      <hemisphereLight args={['#f2f6fb', '#2a241c', 0.35]} />
      <directionalLight
        position={[4.5, 6.2, 3.2]}
        intensity={0.85}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        shadow-camera-left={-3.2}
        shadow-camera-right={3.2}
        shadow-camera-top={3.2}
        shadow-camera-bottom={-3.2}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
      />
      <directionalLight position={[-3.5, 2.8, -2]} intensity={0.45} color="#c9d8ea" />
      <AimedSpot position={[1.6, 3.3, 1.6]} aim={table} intensity={6} angle={0.5} />
      <AimedSpot position={[-0.2, 3.1, 2.2]} aim={fridge} intensity={5} angle={0.42} />
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
