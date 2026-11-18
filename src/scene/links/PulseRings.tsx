import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../../config/devices'

const WHITE = new THREE.Color('#ffffff')
const FORWARD = new THREE.Vector3(0, 0, 1)
/** Metri iniziali in cui l'anello compare. */
const FADE_IN = 0.1

interface PulseRingsProps {
  /** Percorso dalla sorgente alla destinazione. L'ultimo punto è il traguardo. */
  points: Vec3[]
  colorOf: () => string
  /** Metri al secondo lungo il percorso. */
  speed?: number
  count?: number
  /** Raggio dell'anello alla partenza e all'arrivo, in metri. */
  radius?: [number, number]
  /** Metri finali in cui l'anello si dissolve. A destinazione l'opacità è zero. */
  fadeOut?: number
  /** Opacità massima, a metà percorso. */
  peak?: number
}

/**
 * Fronti d'onda che partono dalla sorgente e si allargano lungo il percorso.
 * La vita di ogni anello è misurata in metri sulla distanza sorgente-destinazione:
 * a destinazione l'opacità è zero e l'anello riparte dalla sorgente, senza oltrepassarla.
 * Il colore è schiarito, additivo e non tone-mapped, così gli anelli arrivano al Bloom.
 */
export function PulseRings({
  points,
  colorOf,
  speed = 0.34,
  count = 6,
  radius = [0.03, 0.085],
  fadeOut = 0.38,
  peak = 0.62,
}: PulseRingsProps) {
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const colorOfRef = useRef(colorOf)
  colorOfRef.current = colorOf

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))),
    [points],
  )
  /** Distanza esatta da percorrere, dalla sorgente alla destinazione. */
  const distance = useMemo(() => curve.getLength(), [curve])
  const geometry = useMemo(() => new THREE.TorusGeometry(1, 0.085, 8, 48), [])
  const materials = useMemo(
    () =>
      Array.from(
        { length: count },
        () =>
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
            toneMapped: false,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [count],
  )
  const scratch = useMemo(
    () => ({ tint: new THREE.Color(), tangent: new THREE.Vector3(), toCamera: new THREE.Vector3() }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials])

  useFrame((state) => {
    scratch.tint.set(colorOfRef.current()).lerp(WHITE, 0.25)
    const head = state.clock.elapsedTime * speed

    for (let index = 0; index < count; index += 1) {
      const mesh = meshes.current[index]
      if (!mesh) continue
      const travelled = (head + (index / count) * distance) % distance
      const remaining = distance - travelled
      const along = travelled / distance
      const opacity =
        peak *
        THREE.MathUtils.smoothstep(travelled, 0, FADE_IN) *
        THREE.MathUtils.smoothstep(remaining, 0, fadeOut)

      const material = materials[index]
      material.opacity = opacity
      material.color.copy(scratch.tint)
      mesh.visible = opacity > 0.003
      if (!mesh.visible) continue

      curve.getPointAt(along, mesh.position)
      curve.getTangentAt(along, scratch.tangent)
      // Il fronte d'onda è perpendicolare alla direzione di viaggio, ma piegato a metà
      // verso la camera: resta un cerchio leggibile e non si riduce mai a un trattino di taglio.
      scratch.toCamera.copy(state.camera.position).sub(mesh.position).normalize()
      if (scratch.tangent.dot(scratch.toCamera) < 0) scratch.tangent.negate()
      scratch.tangent.add(scratch.toCamera).normalize()
      mesh.quaternion.setFromUnitVectors(FORWARD, scratch.tangent)
      mesh.scale.setScalar(THREE.MathUtils.lerp(radius[0], radius[1], along))
    }
  })

  return (
    <group>
      {materials.map((material, index) => (
        <mesh
          key={index}
          ref={(mesh) => {
            meshes.current[index] = mesh
          }}
          geometry={geometry}
          material={material}
          frustumCulled={false}
        />
      ))}
    </group>
  )
}
