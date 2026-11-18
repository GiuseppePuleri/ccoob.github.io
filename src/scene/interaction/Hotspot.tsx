import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Camera } from 'three'
import { hotspotAnchor } from '../../config/devices'
import { palette } from '../../config/theme'
import { deviceCopy } from '../../content/it'
import type { DeviceId } from '../../store/types'
import { useAppStore } from '../../store/useAppStore'

const projected = new THREE.Vector3()

/** Tiene la scheda dentro al riquadro anche quando la camera si avvicina. */
function clampPopup(el: THREE.Object3D, camera: Camera, size: { width: number; height: number }): [number, number] {
  projected.setFromMatrixPosition(el.matrixWorld)
  projected.project(camera)
  const x = projected.x * size.width * 0.5 + size.width * 0.5
  const y = -projected.y * size.height * 0.5 + size.height * 0.5
  const halfW = 130
  const halfH = 78
  return [
    Math.min(size.width - halfW - 28, Math.max(28 + halfW, x)),
    Math.min(size.height - halfH - 120, Math.max(148 + halfH, y)),
  ]
}

/** Anello di selezione e pop-up ancorato al dispositivo. */
export function Hotspot({ id }: { id: DeviceId }) {
  const selected = useAppStore((state) => state.selectedDevice === id)
  const content = deviceCopy[id]

  return (
    <group position={hotspotAnchor[id]}>
      <mesh>
        <torusGeometry args={[0.04, 0.003, 8, 28]} />
        <meshStandardMaterial
          color={palette.oob}
          emissive={palette.oob}
          emissiveIntensity={selected ? 0.7 : 0.2}
          roughness={0.4}
        />
      </mesh>
      {selected && (
        <Html
          position={[0, 0.08, 0]}
          center
          calculatePosition={clampPopup}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <article className="xo-pop">
            <p className="xo-kicker">{content.tagline}</p>
            <h2>{content.title}</h2>
            <p>{content.body}</p>
          </article>
        </Html>
      )}
    </group>
  )
}
