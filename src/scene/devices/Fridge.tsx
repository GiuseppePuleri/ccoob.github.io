import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Outlines } from '@react-three/drei'
import * as THREE from 'three'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'

const W = 0.7
const H = 1.56
const D = 0.62
const T = 0.04
const BASE = 0.02

/**
 * Scocca in acciaio chiusa: la rete Wi-Fi muore qui.
 * In selezione la lamiera diventa una velatura e la porta si apre, così si vede il sensore.
 */
export function Fridge() {
  const bind = useDeviceInteraction('fridge')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'fridge' || state.selectedDevice === 'fridge',
  )
  const hinge = useRef<THREE.Group>(null)
  const open = useRef(0.08)
  const shell = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#e7edf3'),
        metalness: 0.84,
        roughness: 0.36,
        envMapIntensity: 1.25,
        clearcoat: 0.4,
        clearcoatRoughness: 0.42,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const rim = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => () => shell.dispose(), [shell])

  useFrame((_, delta) => {
    const selected = useAppStore.getState().selectedDevice === 'fridge'
    const phase = useAppStore.getState().alarmPhase
    const alarming = phase === 'drifting' || phase === 'sms' || phase === 'call'
    const targetOpen = selected ? 1 : 0.07
    open.current = THREE.MathUtils.damp(open.current, targetOpen, selected ? 3.2 : 2.2, delta)
    if (hinge.current) hinge.current.rotation.y = -open.current * 1.15

    const targetOpacity = selected ? 0.22 : 1
    shell.opacity = THREE.MathUtils.damp(shell.opacity, targetOpacity, 3, delta)
    const ghost = shell.opacity < 0.98
    if (shell.transparent !== ghost) {
      shell.transparent = ghost
      shell.needsUpdate = true
    }
    shell.depthWrite = shell.opacity > 0.85

    if (rim.current) {
      const glow = alarming ? 3.6 + Math.sin(performance.now() / 180) * 0.4 : 0
      rim.current.emissiveIntensity = THREE.MathUtils.damp(rim.current.emissiveIntensity, glow, 3, delta)
    }
  })

  const y = BASE + H / 2
  const outline = highlighted ? <Outlines thickness={0.012} color={palette.oob} /> : null

  return (
    <group position={stage.fridge} {...bind}>
      <Shell position={[-(W - T) / 2, y, 0]} args={[T, H, D]} material={shell} />
      <Shell position={[(W - T) / 2, y, 0]} args={[T, H, D]} material={shell} />
      <Shell position={[0, BASE + H - T / 2, 0]} args={[W, T, D]} material={shell} />
      <Shell position={[0, BASE + T / 2, 0]} args={[W, T, D]} material={shell} />
      <Shell position={[0, y, -(D - T) / 2]} args={[W - T * 2, H - T * 2, T]} material={shell} />

      <mesh position={[0, y, -D / 2 + T + 0.004]} receiveShadow>
        <planeGeometry args={[W - T * 2.2, H - T * 2.2]} />
        <meshStandardMaterial color="#171b21" roughness={0.92} metalness={0.05} />
      </mesh>

      <mesh position={[0, 0.58, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.012, 0.42]} />
        <meshStandardMaterial color={palette.steelDeep} metalness={0.9} roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.02, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.56, 0.012, 0.42]} />
        <meshStandardMaterial color={palette.steelDeep} metalness={0.9} roughness={0.38} />
      </mesh>

      <Vials />

      <mesh position={[-W / 2 + 0.045, y, D / 2 - 0.02]}>
        <boxGeometry args={[0.008, H - 0.12, 0.008]} />
        <meshStandardMaterial
          ref={rim}
          color="#000000"
          emissive={palette.alarm}
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      <group ref={hinge} position={[-W / 2 + 0.014, y, D / 2 + 0.008]}>
        <mesh position={[(W - 0.05) / 2, 0, 0]} material={shell} castShadow receiveShadow>
          <boxGeometry args={[W - 0.05, H - 0.05, 0.034]} />
          {outline}
        </mesh>
        <mesh position={[W - 0.11, 0.02, 0.028]} castShadow>
          <capsuleGeometry args={[0.011, 0.34, 4, 12]} />
          <meshStandardMaterial color="#b7c0c9" metalness={1} roughness={0.26} />
        </mesh>
        <mesh position={[(W - 0.05) / 2, 0, -0.02]}>
          <boxGeometry args={[W - 0.09, H - 0.09, 0.012]} />
          <meshStandardMaterial color={palette.rubber} roughness={0.86} metalness={0} />
        </mesh>
      </group>

      <Hotspot id="fridge" />
    </group>
  )
}

function Shell({
  position,
  args,
  material,
}: {
  position: [number, number, number]
  args: [number, number, number]
  material: THREE.Material
}) {
  return (
    <mesh position={position} material={material} castShadow receiveShadow>
      <boxGeometry args={args} />
    </mesh>
  )
}

function Vials() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    const instanced = mesh.current
    if (!instanced) return
    let index = 0
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        dummy.position.set(-0.18 + col * 0.12, 0.64 + row * 0.44, -0.02)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        instanced.setMatrixAt(index, dummy.matrix)
        index += 1
      }
    }
    instanced.instanceMatrix.needsUpdate = true
  }, [dummy])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 8]} castShadow>
      <cylinderGeometry args={[0.016, 0.016, 0.085, 12]} />
      <meshPhysicalMaterial
        color={palette.vial}
        roughness={0.15}
        metalness={0}
        transmission={0.65}
        thickness={0.2}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  )
}
