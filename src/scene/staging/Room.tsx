import * as THREE from 'three'
import { stage } from '../../config/devices'

/** Diorama: pedana, fondale, mensola e il suo sostegno. */
export function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} receiveShadow>
        <circleGeometry args={[2.12, 80]} />
        <meshStandardMaterial color="#1a202a" roughness={0.84} metalness={0.18} />
      </mesh>
      <mesh position={[0, -0.09, 0]} receiveShadow>
        <cylinderGeometry args={[2.12, 2.24, 0.16, 80]} />
        <meshStandardMaterial color="#10141b" roughness={0.55} metalness={0.55} />
      </mesh>
      <mesh position={[0.15, 1.4, -1.7]}>
        <cylinderGeometry args={[3.5, 3.5, 3.2, 56, 1, true, Math.PI * 0.12, Math.PI * 0.76]} />
        <meshStandardMaterial color="#10141b" roughness={1} metalness={0} side={THREE.BackSide} />
      </mesh>
      <mesh position={[0.62, 0.5, -0.4]} castShadow>
        <boxGeometry args={[0.045, 1, 0.045]} />
        <meshStandardMaterial color="#8e97a3" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh position={[1.48, 0.5, -0.4]} castShadow>
        <boxGeometry args={[0.045, 1, 0.045]} />
        <meshStandardMaterial color="#8e97a3" metalness={0.9} roughness={0.32} />
      </mesh>
      <mesh position={stage.shelf} castShadow receiveShadow>
        <boxGeometry args={stage.shelfSize} />
        <meshStandardMaterial color="#c5ccd4" metalness={0.94} roughness={0.24} />
      </mesh>
    </group>
  )
}
