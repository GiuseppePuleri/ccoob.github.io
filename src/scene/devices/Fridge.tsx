import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Outlines, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { fridgeBody, stage } from '../../config/devices'
import { thermal } from '../../config/scenarios'
import { palette } from '../../config/theme'
import { isAlerting } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'

const { width: W, height: H, depth: D, wall: T, base: BASE } = fridgeBody
const DOOR_W = W - 0.05
const DOOR_T = 0.034

/**
 * Scocca in acciaio chiusa: una gabbia di Faraday attorno al sensore.
 * La stessa lamiera fa da parete esterna e interna (materiale a doppia faccia).
 * In selezione fiancate e porta diventano una velatura e la porta si apre, così si vede il sensore.
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
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#dfe5ea'),
        metalness: 1,
        roughness: 0.15,
        envMapIntensity: 1.6,
        side: THREE.DoubleSide,
      }),
    [],
  )
  /** Parete di fondo: stessa lamiera, ma resta opaca. È lì che si vede il sensore incollato. */
  const backWall = useMemo(() => shell.clone(), [shell])
  const rim = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(
    () => () => {
      shell.dispose()
      backWall.dispose()
    },
    [shell, backWall],
  )

  useFrame((_, delta) => {
    const { selectedDevice, alarmPhase } = useAppStore.getState()
    const openFridge = selectedDevice === 'fridge' || selectedDevice === 'sensor'
    const targetOpen = openFridge ? 1 : 0.07
    open.current = THREE.MathUtils.damp(open.current, targetOpen, openFridge ? 3.2 : 2.2, delta)
    if (hinge.current) hinge.current.rotation.y = -open.current * 1.15

    const targetOpacity = openFridge ? 0.22 : 1
    shell.opacity = THREE.MathUtils.damp(shell.opacity, targetOpacity, 3, delta)
    const ghost = shell.opacity < 0.98
    if (shell.transparent !== ghost) {
      shell.transparent = ghost
      shell.needsUpdate = true
    }
    shell.depthWrite = shell.opacity > 0.85

    if (rim.current) {
      const glow = isAlerting(alarmPhase) ? 3.6 + Math.sin(performance.now() / 180) * 0.4 : 0
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
      <Shell position={[0, y, -(D - T) / 2]} args={[W - T * 2, H - T * 2, T]} material={backWall} />

      <GlassShelf position={[0, 0.58, -0.02]} />
      <GlassShelf position={[0, 1.02, -0.02]} />

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
        <RoundedBox
          args={[DOOR_W, H - 0.05, DOOR_T]}
          position={[DOOR_W / 2, 0, 0]}
          radius={0.012}
          smoothness={4}
          material={shell}
          castShadow
          receiveShadow
        >
          {outline}
        </RoundedBox>
        <mesh position={[W - 0.11, 0.02, 0.028]} castShadow>
          <capsuleGeometry args={[0.011, 0.34, 4, 12]} />
          <meshStandardMaterial color="#b7c0c9" metalness={1} roughness={0.26} />
        </mesh>
        <mesh position={[DOOR_W / 2, 0, -0.02]}>
          <boxGeometry args={[W - 0.09, H - 0.09, 0.012]} />
          <meshStandardMaterial color={palette.rubber} roughness={0.86} metalness={0} />
        </mesh>
        <DoorDisplay position={[DOOR_W / 2, 0.46, DOOR_T / 2]} />
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

const DISPLAY_W = 384
const DISPLAY_H = 144

function paintDisplay(ctx: CanvasRenderingContext2D, celsius: number): void {
  const hot = celsius > thermal.maxC
  ctx.fillStyle = '#03060a'
  ctx.fillRect(0, 0, DISPLAY_W, DISPLAY_H)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#6f7c8a'
  ctx.font = '600 20px Menlo, Consolas, monospace'
  ctx.fillText('TEMP', 22, 28)
  ctx.textAlign = 'center'
  ctx.fillStyle = hot ? '#ff7381' : '#f2f8ff'
  ctx.font = '600 84px Menlo, Consolas, monospace'
  ctx.fillText(`${celsius.toFixed(1)}°C`, DISPLAY_W / 2, 88)
}

/** Display sulla porta: mostra la temperatura della cella e diventa rosso oltre la soglia. */
function DoorDisplay({ position }: { position: [number, number, number] }) {
  const shown = useRef<number | null>(null)
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = DISPLAY_W
    canvas.height = DISPLAY_H
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    return map
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(() => {
    const celsius = useAppStore.getState().temperatureC
    if (shown.current === celsius) return
    const ctx = (texture.image as HTMLCanvasElement).getContext('2d')
    if (!ctx) return
    paintDisplay(ctx, celsius)
    texture.needsUpdate = true
    shown.current = celsius
  })

  return (
    <group position={position}>
      <mesh position={[0, 0, 0.003]} castShadow>
        <boxGeometry args={[0.26, 0.105, 0.008]} />
        <meshStandardMaterial color="#0b0d10" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.0075]}>
        <planeGeometry args={[0.24, 0.09]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}

const glassShelf = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#e7f2f6'),
  roughness: 0.04,
  metalness: 0,
  transmission: 0.92,
  thickness: 0.25,
  ior: 1.45,
  transparent: true,
})

function GlassShelf({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} material={glassShelf} castShadow receiveShadow>
      <boxGeometry args={[0.56, 0.008, 0.4]} />
    </mesh>
  )
}

const vialGlass = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color('#d7f3ea'),
  roughness: 0.06,
  metalness: 0,
  transmission: 0.88,
  thickness: 0.35,
  ior: 1.5,
  transparent: true,
})

function Vials() {
  const spots: [number, number, number][] = []
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      spots.push([-0.18 + col * 0.12, 0.63 + row * 0.44, -0.02])
    }
  }

  return (
    <group>
      {spots.map((position) => (
        <mesh key={position.join(',')} position={position} material={vialGlass} castShadow>
          <capsuleGeometry args={[0.011, 0.042, 8, 16]} />
        </mesh>
      ))}
    </group>
  )
}
