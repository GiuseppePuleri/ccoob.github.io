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
    </group>
  )
}
