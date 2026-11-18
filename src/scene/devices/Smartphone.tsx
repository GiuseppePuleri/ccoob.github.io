import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Outlines, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import type { AlarmPhase } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'

const SCREEN_W = 256
const SCREEN_H = 512

function paintScreen(ctx: CanvasRenderingContext2D, phase: AlarmPhase, temperature: number): void {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)
  const alarming = phase === 'sms' || phase === 'call'
  ctx.fillStyle = alarming ? '#14080b' : '#07110f'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  ctx.fillStyle = alarming ? '#ff4d5e' : '#6ef3df'
  ctx.fillRect(0, 0, SCREEN_W, 6)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#d5e4df'
  ctx.font = '26px Palatino, Georgia, serif'
  ctx.fillText('CrossCheck', SCREEN_W / 2, 78)

  if (phase === 'drifting') {
    ctx.fillStyle = '#ffb15a'
    ctx.font = '68px Palatino, Georgia, serif'
    ctx.fillText(`${temperature.toFixed(1)}°`, SCREEN_W / 2, SCREEN_H / 2)
    ctx.fillStyle = '#f2efe8'
    ctx.font = '22px Palatino, Georgia, serif'
    ctx.fillText('in salita', SCREEN_W / 2, SCREEN_H / 2 + 64)
    return
  }

  if (phase === 'sms' || phase === 'call') {
    ctx.fillStyle = '#ffd0d5'
    ctx.font = '32px Palatino, Georgia, serif'
    ctx.fillText(phase === 'call' ? 'chiamata' : 'messaggio', SCREEN_W / 2, 210)
    ctx.fillStyle = '#fff7f7'
    ctx.font = '22px Palatino, Georgia, serif'
    const lines = phase === 'call' ? ['Nessuna conferma.', 'Rispondi.'] : ['Sbalzo termico.', 'Apri l’avviso.']
    lines.forEach((line, index) => ctx.fillText(line, SCREEN_W / 2, 280 + index * 36))
    return
  }

  ctx.strokeStyle = '#6ef3df'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(SCREEN_W / 2, SCREEN_H / 2, 34, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#e7edf2'
  ctx.font = '22px Palatino, Georgia, serif'
  ctx.fillText('in ascolto', SCREEN_W / 2, SCREEN_H / 2 + 72)
}

export function Smartphone() {
  const bind = useDeviceInteraction('smartphone')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'smartphone' || state.selectedDevice === 'smartphone',
  )
  const group = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshStandardMaterial>(null)
  const drawn = useRef<{ phase: AlarmPhase; temp: number }>({ phase: 'idle', temp: -1 })

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D non disponibile')
    paintScreen(ctx, 'idle', 5)
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 4
    map.userData.ctx = ctx
    return map
  }, [])

  useFrame((state) => {
    const { alarmPhase, temperatureC, reducedMotion } = useAppStore.getState()
    const ctx = texture.userData.ctx as CanvasRenderingContext2D | undefined
    const tempBucket = alarmPhase === 'drifting' ? temperatureC : 0
    if (ctx && (drawn.current.phase !== alarmPhase || drawn.current.temp !== tempBucket)) {
      paintScreen(ctx, alarmPhase, temperatureC)
      texture.needsUpdate = true
      drawn.current = { phase: alarmPhase, temp: tempBucket }
    }

    const alarming = alarmPhase === 'sms' || alarmPhase === 'call'
    if (screenMat.current) {
      const pulse = alarming ? 3.6 + Math.sin(state.clock.elapsedTime * (alarmPhase === 'call' ? 10 : 3)) * 0.35 : 0.45
      screenMat.current.emissiveIntensity = pulse
    }

    if (!group.current) return
    const shake = !reducedMotion && alarmPhase === 'call' ? Math.sin(state.clock.elapsedTime * 32) * 0.012 : 0
    group.current.rotation.z = shake
  })

  return (
    <group ref={group} position={stage.phone} rotation={[0, 0.62, 0]} {...bind}>
      <RoundedBox args={[0.1, 0.2, 0.012]} position={[0, 0.11, 0]} radius={0.01} smoothness={5} castShadow>
        <meshStandardMaterial color={palette.plasticCool} roughness={0.42} metalness={0.12} />
        {highlighted && <Outlines thickness={0.006} color={palette.oob} />}
      </RoundedBox>
      <mesh position={[0, 0.11, 0.007]}>
        <planeGeometry args={[0.082, 0.168]} />
        <meshStandardMaterial
          ref={screenMat}
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.45}
          toneMapped={false}
          roughness={0.35}
        />
      </mesh>
      <Hotspot id="smartphone" />
    </group>
  )
}
