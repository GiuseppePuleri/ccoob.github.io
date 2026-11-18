import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Vec3 } from '../../config/devices'

/**
 * Nastro luminoso lungo una curva.
 * L'intensità supera 1 e `toneMapped` è spento: solo le creste passano la soglia del Bloom.
 * `endFade` anticipa lo spegnimento. Sul Wi-Fi è basso, così l'onda muore sull'acciaio.
 */
const vertexShader = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  in vec2 vUv;
  uniform float uTime;
  uniform float uPhase;
  uniform float uSpeed;
  uniform float uEndFade;
  uniform float uIntensity;
  uniform vec3 uColor;
  out vec4 fragColor;

  void main() {
    float along = vUv.x;
    float across = abs(vUv.y - 0.5) * 2.0;
    float wave = sin((along * 7.0 - uTime * uSpeed + uPhase) * 6.2831853);
    float crest = smoothstep(0.2, 1.0, wave);
    float core = pow(1.0 - across, 1.7);
    float head = smoothstep(0.0, 0.045, along);
    float tail = 1.0 - smoothstep(uEndFade, 1.0, along);
    float alpha = crest * core * head * tail;
    if (alpha < 0.02) discard;
    fragColor = vec4(uColor * uIntensity, alpha);
  }
`

interface WaveRibbonProps {
  points: Vec3[]
  phase?: number
  radius?: number
  endFade?: number
  speed?: number
  intensity?: number
  colorOf: () => string
  visibleOf?: () => boolean
}

export function WaveRibbon({
  points,
  phase = 0,
  radius = 0.011,
  endFade = 0.92,
  speed = 0.85,
  intensity = 2.6,
  colorOf,
  visibleOf,
}: WaveRibbonProps) {
  const colorOfRef = useRef(colorOf)
  const visibleOfRef = useRef(visibleOf)
  colorOfRef.current = colorOf
  visibleOfRef.current = visibleOf

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)))
    return new THREE.TubeGeometry(curve, 120, radius, 10, false)
  }, [points, radius])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: phase },
        uSpeed: { value: speed },
        uEndFade: { value: endFade },
        uIntensity: { value: intensity },
        uColor: { value: new THREE.Color('#ffffff') },
      },
      vertexShader,
      fragmentShader,
    })
  }, [phase, speed, endFade, intensity])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uColor.value.set(colorOfRef.current())
    if (mesh.current) mesh.current.visible = visibleOfRef.current?.() ?? true
  })

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />
}
