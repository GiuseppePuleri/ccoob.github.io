import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Outlines, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { copy } from '../../content/it'
import { isEscalating } from '../../store/selectors'
import type { AlarmPhase } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'

const SCREEN_W = 360
const SCREEN_H = 720
const SANS = '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif'
/** Durata dell'ingresso di ogni notifica, in secondi. */
const ENTER_SEC = 0.45
/** Inclinazione all'indietro sul supporto, in radianti. */
const TILT = 0.3
/** Altezza di una notifica sulla schermata di blocco, in pixel della texture. */
const CARD_H = 188
const text = copy.phoneScreen

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function paintBackdrop(ctx: CanvasRenderingContext2D, top: string, bottom: string): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, SCREEN_H)
  gradient.addColorStop(0, top)
  gradient.addColorStop(1, bottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
}

function paintClock(ctx: CanvasRenderingContext2D): void {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#eef3f6'
  ctx.font = `300 76px ${SANS}`
  ctx.fillText(text.clock, SCREEN_W / 2, 96)
}

/** Notifica in stile schermata di blocco. `enter` va da 0 (fuori) a 1 (in posizione). */
function paintCard(
  ctx: CanvasRenderingContext2D,
  y: number,
  enter: number,
  dim: number,
  accent: string,
  content: { kicker: string; title: string; lines: readonly string[] },
): void {
  const eased = 1 - (1 - enter) ** 3
  const top = y - (1 - eased) * 70
  ctx.save()
  ctx.globalAlpha = eased * dim
  roundRect(ctx, 14, top, SCREEN_W - 28, CARD_H, 24)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.fill()
  ctx.fillStyle = accent
  roundRect(ctx, 14, top, 6, CARD_H, 3)
  ctx.fill()

  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = accent
  ctx.font = `700 22px ${SANS}`
  ctx.fillText(content.kicker, 36, top + 34)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.font = `400 20px ${SANS}`
  ctx.fillText(text.now, SCREEN_W - 32, top + 34)

  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = `600 30px ${SANS}`
  ctx.fillText(content.title, 36, top + 80)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = `400 24px ${SANS}`
  content.lines.forEach((line, index) => ctx.fillText(line, 36, top + 122 + index * 32))
  ctx.restore()
}

/** Tre pallini in basso: a che punto è l'escalation. */
function paintSteps(ctx: CanvasRenderingContext2D, reached: number): void {
  for (let index = 0; index < 3; index += 1) {
    ctx.beginPath()
    ctx.arc(SCREEN_W / 2 + (index - 1) * 34, 668, 7, 0, Math.PI * 2)
    ctx.fillStyle = index < reached ? '#ff4d5e' : 'rgba(255, 255, 255, 0.28)'
    ctx.fill()
  }
}

function paintCall(ctx: CanvasRenderingContext2D, enter: number, time: number): void {
  paintBackdrop(ctx, '#0a0607', '#0a0607')
  ctx.save()
  ctx.globalAlpha = 1 - (1 - enter) ** 3
  paintBackdrop(ctx, '#ff2f47', '#b30f25')

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = `600 22px ${SANS}`
  ctx.fillText(copy.brand.toUpperCase(), SCREEN_W / 2, 104)
  ctx.fillStyle = '#ffffff'
  ctx.font = `700 40px ${SANS}`
  text.call.lines.forEach((line, index) => ctx.fillText(line, SCREEN_W / 2, 176 + index * 52))

  const cx = SCREEN_W / 2
  const cy = 400
  for (let index = 0; index < 3; index += 1) {
    const wave = (time * 0.9 + index / 3) % 1
    ctx.beginPath()
    ctx.arc(cx, cy, 54 + wave * 74, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.7 * (1 - wave)).toFixed(3)})`
    ctx.lineWidth = 4
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(cx, cy, 54, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  // Cornetta: un arco con i due capi ingrossati.
  ctx.strokeStyle = '#c4122a'
  ctx.lineWidth = 11
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy + 14, 26, Math.PI * 1.12, Math.PI * 1.88)
  ctx.stroke()
  ctx.fillStyle = '#c4122a'
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(cx + side * 25, cy + 10, 9, 0, Math.PI * 2)
    ctx.fill()
  }

  const buttons = [
    { x: 98, fill: '#5e0a16', label: text.call.decline },
    { x: SCREEN_W - 98, fill: '#2fd17a', label: text.call.answer },
  ]
  for (const button of buttons) {
    ctx.beginPath()
    ctx.arc(button.x, 596, 38, 0, Math.PI * 2)
    ctx.fillStyle = button.fill
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = `500 19px ${SANS}`
    ctx.fillText(button.label, button.x, 662)
  }
  ctx.restore()
}

function paintScreen(
  ctx: CanvasRenderingContext2D,
  phase: AlarmPhase,
  temperature: number,
  enter: number,
  time: number,
): void {
  if (phase === 'call') {
    paintCall(ctx, enter, time)
    return
  }

  if (phase === 'email' || phase === 'sms') {
    paintBackdrop(ctx, '#1a0d12', '#07090c')
    paintClock(ctx)
    const sms = phase === 'sms'
    paintCard(ctx, 172, sms ? 1 : enter, sms ? 0.55 : 1, '#ffb15a', text.email)
    if (sms) paintCard(ctx, 172 + CARD_H + 16, enter, 1, '#ff6b78', text.sms)
    paintSteps(ctx, sms ? 2 : 1)
    return
  }

  paintBackdrop(ctx, '#0b1614', '#05080a')
  paintClock(ctx)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (phase === 'drifting') {
    ctx.fillStyle = '#ffb15a'
    ctx.font = `300 104px ${SANS}`
    ctx.fillText(`${temperature.toFixed(1)}°`, SCREEN_W / 2, SCREEN_H / 2)
    ctx.fillStyle = '#f2efe8'
    ctx.font = `400 26px ${SANS}`
    ctx.fillText(text.rising, SCREEN_W / 2, SCREEN_H / 2 + 86)
    return
  }

  ctx.strokeStyle = '#6ef3df'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(SCREEN_W / 2, SCREEN_H / 2, 52, 0, Math.PI * 2)
  ctx.stroke()
  if (phase === 'acknowledged') {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(SCREEN_W / 2 - 22, SCREEN_H / 2 + 2)
    ctx.lineTo(SCREEN_W / 2 - 6, SCREEN_H / 2 + 18)
    ctx.lineTo(SCREEN_W / 2 + 24, SCREEN_H / 2 - 16)
    ctx.stroke()
  }
  ctx.fillStyle = '#e7edf2'
  ctx.font = `400 26px ${SANS}`
  ctx.fillText(phase === 'acknowledged' ? text.confirmed : text.listening, SCREEN_W / 2, SCREEN_H / 2 + 104)
}

/**
 * Smartphone sul supporto. Lo schermo è una texture ridisegnata dalla fase d'allarme:
 * email, poi SMS, poi chiamata vocale a tutto schermo. I tempi li decide il director.
 */
export function Smartphone() {
  const bind = useDeviceInteraction('smartphone')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'smartphone' || state.selectedDevice === 'smartphone',
  )
  const tilt = useRef<THREE.Group>(null)
  const screenMat = useRef<THREE.MeshBasicMaterial>(null)
  const step = useRef<{ phase: AlarmPhase | null; since: number }>({ phase: null, since: 0 })
  const drawn = useRef('')

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = SCREEN_W
    canvas.height = SCREEN_H
    const map = new THREE.CanvasTexture(canvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    return map
  }, [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state) => {
    const { alarmPhase, temperatureC, reducedMotion } = useAppStore.getState()
    const time = state.clock.elapsedTime
    if (step.current.phase !== alarmPhase) step.current = { phase: alarmPhase, since: time }

    const enter = reducedMotion ? 1 : Math.min(1, (time - step.current.since) / ENTER_SEC)
    const ringing = alarmPhase === 'call' && !reducedMotion
    const animating = enter < 1 || ringing
    const key = `${alarmPhase}|${alarmPhase === 'drifting' ? temperatureC : ''}`
    if (animating || drawn.current !== key) {
      const ctx = (texture.image as HTMLCanvasElement).getContext('2d')
      if (ctx) {
        paintScreen(ctx, alarmPhase, temperatureC, enter, time)
        texture.needsUpdate = true
        drawn.current = animating ? '' : key
      }
    }

    if (screenMat.current) screenMat.current.color.setScalar(isEscalating(alarmPhase) ? 1 : 0.82)
    if (tilt.current) tilt.current.rotation.z = ringing ? Math.sin(time * 32) * 0.012 : 0
  })

  return (
    <group position={stage.phone} rotation={[0, 0.2, 0]} {...bind}>
      <mesh position={[0, 0.004, -0.018]} castShadow receiveShadow>
        <boxGeometry args={[0.07, 0.008, 0.078]} />
        <meshStandardMaterial color="#1c1f24" roughness={0.55} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.044, -0.032]} rotation={[0.467, 0, 0]} castShadow>
        <boxGeometry args={[0.04, 0.081, 0.004]} />
        <meshStandardMaterial color="#1c1f24" roughness={0.55} metalness={0.35} />
      </mesh>
      <group ref={tilt} position={[0, 0.008, 0.012]} rotation={[-TILT, 0, 0]}>
        <RoundedBox
          args={[0.072, 0.148, 0.008]}
          position={[0, 0.074, 0]}
          radius={0.0038}
          smoothness={5}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#15181c" roughness={0.32} metalness={0.7} />
          {highlighted && <Outlines thickness={0.005} color={palette.oob} />}
        </RoundedBox>
        <mesh position={[0, 0.074, 0.0046]}>
          <planeGeometry args={[0.066, 0.132]} />
          <meshBasicMaterial ref={screenMat} map={texture} toneMapped={false} />
        </mesh>
      </group>
      <Hotspot id="smartphone" />
    </group>
  )
}
