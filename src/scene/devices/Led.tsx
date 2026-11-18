import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../../config/devices'

interface LedProps {
  position: Vec3
  colorOf: () => string
  size?: number
}

/** Spia emissiva, sopra la soglia del Bloom. Il colore segue lo stato del dispositivo. */
export function Led({ position, colorOf, size = 0.011 }: LedProps) {
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const colorOfRef = useRef(colorOf)
  colorOfRef.current = colorOf

  useFrame((state) => {
    const mat = material.current
    if (!mat) return
    const color = colorOfRef.current()
    mat.color.set(color)
    mat.emissive.set(color)
    mat.emissiveIntensity = 4.4 + Math.sin(state.clock.elapsedTime * 5.2) * 0.7
  })

  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 18, 18]} />
      <meshStandardMaterial
        ref={material}
        color="#111111"
        emissive="#111111"
        emissiveIntensity={0}
        toneMapped={false}
      />
    </mesh>
  )
}
