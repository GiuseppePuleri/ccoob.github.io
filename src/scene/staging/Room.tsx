import { useMemo } from 'react'
import * as THREE from 'three'
import { stage } from '../../config/devices'
import type { Vec3 } from '../../config/devices'

/** Quattro gambe sotto gli angoli del piano, rientrate di qualche centimetro. */
const legHeight = stage.shelf[1] - stage.shelfSize[1] / 2
const legs: Vec3[] = [-1, 1].flatMap((side) =>
  [-1, 1].map(
    (end): Vec3 => [
      stage.shelf[0] + side * (stage.shelfSize[0] / 2 - 0.07),
      legHeight / 2,
      stage.shelf[2] + end * (stage.shelfSize[2] / 2 - 0.07),
    ],
  ),
)

/** Pedana e tavolo. Lo sfondo è l'HDRI, non un fondale grigio. */
export function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <circleGeometry args={[2.12, 80]} />
        <meshStandardMaterial color="#4a524c" roughness={0.72} metalness={0.12} />
      </mesh>
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <cylinderGeometry args={[2.12, 2.24, 0.16, 80]} />
        <meshStandardMaterial color="#2c3330" roughness={0.5} metalness={0.4} />
      </mesh>
      {legs.map((position) => (
        <mesh key={position.join(',')} position={position} castShadow>
          <boxGeometry args={[0.045, legHeight, 0.045]} />
          <meshStandardMaterial color="#8e97a3" metalness={0.9} roughness={0.32} />
        </mesh>
      ))}
      <mesh position={stage.shelf} castShadow receiveShadow>
        <boxGeometry args={stage.shelfSize} />
        <meshStandardMaterial color="#8d948c" metalness={0.15} roughness={0.62} />
      </mesh>
      <GatewayPower />
    </group>
  )
}

const PANEL_Z = stage.shelf[2] - stage.shelfSize[2] / 2 - 0.045
const SOCKET: Vec3 = [stage.gateway[0] - 0.18, stage.shelf[1] + 0.2, PANEL_Z + 0.026]

/**
 * Quinta tecnica dietro al tavolo, presa Schuko stilizzata e alimentazione del gateway.
 * Il cavo è una vera geometria cilindrica: mantiene uno spessore fisico a ogni distanza.
 */
function GatewayPower() {
  const cable = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(stage.gateway[0], stage.gateway[1] + 0.11, stage.gateway[2] - 0.03),
          new THREE.Vector3(stage.gateway[0] - 0.02, stage.gateway[1] + 0.018, stage.gateway[2] - 0.1),
          new THREE.Vector3(stage.gateway[0] - 0.08, stage.gateway[1] + 0.012, PANEL_Z + 0.14),
          new THREE.Vector3(SOCKET[0], SOCKET[1] - 0.08, SOCKET[2] + 0.035),
          new THREE.Vector3(...SOCKET),
        ],
        false,
        'centripetal',
      ),
    [],
  )

  return (
    <group>
      <mesh position={[stage.shelf[0], stage.shelf[1] + 0.34, PANEL_Z]} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.68, 0.035]} />
        <meshStandardMaterial color="#d8ddd7" roughness={0.82} metalness={0.02} />
      </mesh>

      <group position={SOCKET}>
        <mesh castShadow>
          <boxGeometry args={[0.105, 0.12, 0.018]} />
          <meshStandardMaterial color="#f0f1ec" roughness={0.72} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0, 0.011]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.008, 24]} />
          <meshStandardMaterial color="#d5d8d2" roughness={0.78} />
        </mesh>
        {[-0.013, 0.013].map((x) => (
          <mesh key={x} position={[x, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0045, 0.0045, 0.008, 12]} />
            <meshStandardMaterial color="#202326" roughness={0.72} />
          </mesh>
        ))}
      </group>

      <mesh castShadow>
        <tubeGeometry args={[cable, 56, 0.007, 10, false]} />
        <meshStandardMaterial color="#101214" roughness={0.76} metalness={0.02} />
      </mesh>

      <mesh position={SOCKET} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.021, 0.026, 16]} />
        <meshStandardMaterial color="#111315" roughness={0.7} />
      </mesh>
    </group>
  )
}
