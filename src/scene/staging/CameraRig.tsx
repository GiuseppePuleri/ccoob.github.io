import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { damp3 } from 'maath/easing'
import * as THREE from 'three'
import { cameraHome, cameraIntro } from '../../config/devices'
import { useAppStore } from '../../store/useAppStore'

type RigControls = {
  target: THREE.Vector3
  enabled: boolean
  update: () => void
} | null

/** Sotto questa distanza la transizione si considera conclusa e torna il free roaming. */
const ARRIVAL = 0.05

/**
 * Controller della camera.
 * - Intro: panoramica guidata fino a `cameraHome`.
 * - Comandi mirati: interpola verso `targetPosition` / `lookAtTarget` solo mentre
 *   `isAnimatingCamera` è true, poi rilascia il controllo.
 * - Drag dell'utente: interrompe subito l'animazione.
 */
export function CameraRig() {
  const exploring = useAppStore((state) => state.appPhase === 'explore')
  const introStart = useRef(performance.now())
  const controls = useRef<RigControls>(null)
  const dragging = useRef(false)

  const scratch = useMemo(
    () => ({
      homePos: new THREE.Vector3(...cameraHome.position),
      homeTarget: new THREE.Vector3(...cameraHome.target),
      introPos: new THREE.Vector3(...cameraIntro.position),
      introTarget: new THREE.Vector3(...cameraIntro.target),
      destination: new THREE.Vector3(),
      lookAt: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      target: new THREE.Vector3(),
    }),
    [],
  )

  useFrame((state, delta) => {
    const rig = controls.current
    if (!rig) return
    const store = useAppStore.getState()

    if (store.appPhase !== 'explore') {
      const t = store.reducedMotion
        ? 1
        : Math.min(1, (performance.now() - introStart.current) / 2400)
      const eased = 1 - (1 - t) ** 3
      scratch.pos.lerpVectors(scratch.introPos, scratch.homePos, eased)
      scratch.target.lerpVectors(scratch.introTarget, scratch.homeTarget, eased)
      state.camera.position.copy(scratch.pos)
      rig.target.copy(scratch.target)
      rig.update()
      return
    }

    if (!store.isAnimatingCamera || dragging.current) return

    scratch.destination.set(...store.targetPosition)
    scratch.lookAt.set(...store.lookAtTarget)

    if (store.reducedMotion) {
      state.camera.position.copy(scratch.destination)
      rig.target.copy(scratch.lookAt)
    } else {
      // smoothTime ~0.35s: arrivo morbido senza overshoot.
      damp3(state.camera.position, scratch.destination, 0.35, delta)
      damp3(rig.target, scratch.lookAt, 0.35, delta)
    }
    rig.update()

    const arrived =
      state.camera.position.distanceTo(scratch.destination) < ARRIVAL &&
      rig.target.distanceTo(scratch.lookAt) < ARRIVAL

    if (arrived) {
      state.camera.position.copy(scratch.destination)
      rig.target.copy(scratch.lookAt)
      rig.update()
      store.releaseCamera()
    }
  })

  return (
    <OrbitControls
      ref={(instance) => {
        controls.current = instance
      }}
      makeDefault
      enabled={exploring}
      enablePan
      enableZoom
      enableRotate
      target={cameraHome.target}
      onStart={() => {
        dragging.current = true
        const store = useAppStore.getState()
        if (store.isAnimatingCamera) store.releaseCamera()
      }}
      onEnd={() => {
        dragging.current = false
      }}
    />
  )
}
