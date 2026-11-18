import { useRef } from 'react'
import type { SyntheticEvent } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { calloutAnchor, hotspotAnchor } from '../../config/devices'
import { palette } from '../../config/theme'
import { copy, deviceCopy } from '../../content/it'
import { isEscalating } from '../../store/selectors'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

/** Scostamento della scheda dal punto d'ancoraggio, in pixel: a destra e in alto. */
const GAP_X = 76
const GAP_Y = 52
/** Margini dello schermo che la scheda non invade: bordi, HUD in alto, pulsanti in basso. */
const MARGIN = 20
const SAFE_TOP = 88
const SAFE_BOTTOM = 104

const projected = new THREE.Vector3()

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/** Il clic su "Chiudi" resta nel pop-up: non deve arrivare al raycaster della scena. */
function keepFromScene(event: SyntheticEvent): void {
  event.stopPropagation()
}

/**
 * Anello di selezione e pop-up del dispositivo.
 * La scheda non sta sopra l'oggetto: si apre di lato, collegata da una linea guida,
 * e lascia passare i clic verso la scena. Solo il tasto "Chiudi" li intercetta.
 */
export function Hotspot({ id }: { id: DeviceId }) {
  const selected = useAppStore((state) => state.selectedDevice === id)
  /** Durante l'escalation la scena è del telefono e della sua notifica: anelli e pop-up si fanno da parte. */
  const escalating = useAppStore((state) => isEscalating(state.alarmPhase))
  const showCard = selected && !escalating
  const content = deviceCopy[id]
  const anchor = useRef<THREE.Group>(null)
  const card = useRef<HTMLElement>(null)
  const leader = useRef<SVGLineElement>(null)

  useFrame(({ camera, size }) => {
    if (!showCard || !anchor.current || !card.current || !leader.current) return

    // Stessa posa che usa <Html> in questo frame, altrimenti la scheda insegue la camera in ritardo.
    camera.updateMatrixWorld()
    anchor.current.getWorldPosition(projected).project(camera)
    const anchorX = (projected.x * 0.5 + 0.5) * size.width
    const anchorY = (0.5 - projected.y * 0.5) * size.height
    const width = card.current.offsetWidth
    const height = card.current.offsetHeight

    // A destra dell'ancora; se non c'è posto, a sinistra. Poi dentro i margini dello schermo.
    let left = anchorX + GAP_X
    if (left + width > size.width - MARGIN) left = anchorX - GAP_X - width
    left = clamp(left, MARGIN, size.width - width - MARGIN)
    const top = clamp(anchorY - GAP_Y - height, SAFE_TOP, size.height - height - SAFE_BOTTOM)

    // Il contenitore è già sull'ancora: la scheda si sposta rispetto a quel punto.
    const dx = left - anchorX
    const dy = top - anchorY
    card.current.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
    card.current.style.opacity = '1'

    // La linea guida va dall'ancora al punto più vicino della scheda.
    leader.current.setAttribute('x2', clamp(0, dx, dx + width).toFixed(1))
    leader.current.setAttribute('y2', clamp(0, dy, dy + height).toFixed(1))
  })

  return (
    <>
      <group position={hotspotAnchor[id]}>
        <mesh visible={!escalating}>
          <torusGeometry args={[0.04, 0.003, 8, 28]} />
          <meshStandardMaterial
            color={palette.oob}
            emissive={palette.oob}
            emissiveIntensity={selected ? 0.7 : 0.2}
            roughness={0.4}
          />
        </mesh>
      </group>
      <group ref={anchor} position={calloutAnchor[id]}>
        {showCard && (
          <Html zIndexRange={[40, 0]} className="xo-callout">
            <svg className="xo-leader" aria-hidden="true">
              <line ref={leader} x1="0" y1="0" x2="0" y2="0" />
              <circle className="xo-leader-ring" r="7" />
              <circle r="2.6" />
            </svg>
            <article ref={card} className="xo-pop">
              <button
                type="button"
                className="xo-pop-close"
                aria-label={copy.close}
                onPointerDown={keepFromScene}
                onPointerUp={keepFromScene}
                onPointerMove={keepFromScene}
                onClick={(event) => {
                  event.stopPropagation()
                  useAppStore.getState().selectDevice(null)
                }}
              >
                ×
              </button>
              <p className="xo-kicker">{content.tagline}</p>
              <h2>{content.title}</h2>
              <p>{content.body}</p>
            </article>
          </Html>
        )}
      </group>
    </>
  )
}
