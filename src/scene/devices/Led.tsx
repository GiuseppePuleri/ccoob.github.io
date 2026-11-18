import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Vec3 } from '../../config/devices'

interface LedProps {
  position: Vec3
  colorOf: () => string
  activeOf: () => boolean
  size?: number
}

/** Emissivo sopra la soglia del Bloom solo quando è acceso. */
export function Led({ position, colorOf, activeOf, size = 0.011 }: LedProps) {
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const colorOfRef = useRef(colorOf)
  const activeOfRef = useRef(activeOf)
  colorOfRef.current = colorOf
  activeOfRef.current = activeOf

  useFrame((state) => {
    const mat = material.current
    if (!mat) return
    const on = activeOfRef.current()
    const color = on ? colorOfRef.current() : '#14171c'
    mat.color.set(color)
    mat.emissive.set(on ? color : '#000000')
    const pulse = 4.4 + Math.sin(state.clock.elapsedTime * 5.2) * 0.7
    mat.emissiveIntensity = on ? pulse : 0
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
