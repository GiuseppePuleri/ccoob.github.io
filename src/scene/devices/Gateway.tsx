import { Outlines } from '@react-three/drei'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { isEscalating } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'
import { Led } from './Led'

function alarmTint(fallback: string): string {
  const phase = useAppStore.getState().alarmPhase
  if (isEscalating(phase)) return palette.alarm
  if (phase === 'drifting') return palette.amber
  return fallback
}

export function Gateway() {
  const bind = useDeviceInteraction('gateway')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'gateway' || state.selectedDevice === 'gateway',
  )

  return (
    <group position={stage.gateway} {...bind}>
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.28, 0.05]} />
        <meshStandardMaterial color="#4e575f" roughness={0.55} metalness={0.18} />
        {highlighted && <Outlines thickness={0.008} color={palette.oob} />}
      </mesh>
      <mesh position={[0, 0.14, 0.027]}>
        <boxGeometry args={[0.1, 0.16, 0.004]} />
        <meshStandardMaterial color="#c5ced8" roughness={0.6} metalness={0.04} />
      </mesh>
      <mesh position={[-0.03, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.03, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.0035, 0.0035, 0.2, 8]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.8} roughness={0.3} />
      </mesh>
      <Led position={[-0.04, 0.05, 0.028]} colorOf={() => palette.ledOn} />
      <Led position={[0, 0.05, 0.028]} colorOf={() => alarmTint(palette.oob)} />
      <Led position={[0.04, 0.05, 0.028]} colorOf={() => alarmTint(palette.oob)} />
      <Hotspot id="gateway" />
    </group>
  )
}
