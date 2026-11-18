import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { cameraAlarm, cameraHome, cameraIntro, devices } from '../../config/devices'
import { isEscalating } from '../../store/selectors'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

type RigControls = { target: THREE.Vector3; update: () => void } | null

export function CameraRig() {
  const exploring = useAppStore((state) => state.appPhase === 'explore')
  const dragging = useRef(false)
  const introStart = useRef(performance.now())
  const controls = useRef<RigControls>(null)

  const poses = useMemo(() => {
    const byDevice = {} as Record<DeviceId, { position: THREE.Vector3; target: THREE.Vector3 }>
    for (const device of devices) {
      byDevice[device.id] = {
        position: new THREE.Vector3(...device.cameraPreset.position),
        target: new THREE.Vector3(...device.cameraPreset.target),
      }
    }
    return {
      byDevice,
      homePos: new THREE.Vector3(...cameraHome.position),
      homeTarget: new THREE.Vector3(...cameraHome.target),
      introPos: new THREE.Vector3(...cameraIntro.position),
      introTarget: new THREE.Vector3(...cameraIntro.target),
      alarmPos: new THREE.Vector3(...cameraAlarm.position),
      alarmTarget: new THREE.Vector3(...cameraAlarm.target),
      pos: new THREE.Vector3(),
      target: new THREE.Vector3(),
    }
  }, [])

  useFrame((state, delta) => {
    const rig = controls.current
    if (!rig || dragging.current) return
    const { selectedDevice, alarmPhase, appPhase, reducedMotion } = useAppStore.getState()

    if (appPhase !== 'explore') {
      const t = reducedMotion ? 1 : Math.min(1, (performance.now() - introStart.current) / 2400)
      const eased = 1 - (1 - t) ** 3
      poses.pos.lerpVectors(poses.introPos, poses.homePos, eased)
      poses.target.lerpVectors(poses.introTarget, poses.homeTarget, eased)
    } else if (selectedDevice) {
      poses.pos.copy(poses.byDevice[selectedDevice].position)
      poses.target.copy(poses.byDevice[selectedDevice].target)
    } else if (isEscalating(alarmPhase)) {
      poses.pos.copy(poses.alarmPos)
      poses.target.copy(poses.alarmTarget)
    } else {
      poses.pos.copy(poses.homePos)
      poses.target.copy(poses.homeTarget)
    }

    const gain = reducedMotion ? 1 : 1 - Math.exp(-2.6 * delta)
    state.camera.position.lerp(poses.pos, gain)
    rig.target.lerp(poses.target, gain)
    rig.update()
  })

  return (
    <OrbitControls
      ref={(instance) => {
        controls.current = instance
      }}
      makeDefault
      enabled={exploring}
      enablePan={false}
      enableDamping={false}
      minDistance={0.5}
      maxDistance={7.2}
      minPolarAngle={0.55}
      maxPolarAngle={1.32}
      target={cameraIntro.target}
      onStart={() => {
        dragging.current = true
      }}
      onEnd={() => {
        dragging.current = false
      }}
    />
  )
}
