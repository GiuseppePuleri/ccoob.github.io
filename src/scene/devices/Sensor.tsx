import { Outlines, RoundedBox } from '@react-three/drei'
import { sensorBody, stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { isEscalating } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'
import { Led } from './Led'

const { width: W, height: H, depth: D, pad: PAD } = sensorBody

/**
 * Sensore in verticale sulla parete di fondo, tenuto dal biadesivo.
 * L'origine è il centro del corpo: il retro tocca il biadesivo, il biadesivo la lamiera.
 */
export function Sensor() {
  const bind = useDeviceInteraction('sensor')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'sensor' || state.selectedDevice === 'sensor',
  )

  return (
    <group position={stage.sensor} {...bind}>
      <mesh position={[0, 0, -(D + PAD) / 2]}>
        <boxGeometry args={[W - 0.01, H - 0.012, PAD]} />
        <meshStandardMaterial color="#23262b" roughness={0.95} metalness={0} />
      </mesh>
      <RoundedBox args={[W, H, D]} radius={0.007} smoothness={4} castShadow>
        <meshStandardMaterial color={palette.plastic} roughness={0.5} metalness={0.05} />
        {highlighted && <Outlines thickness={0.005} color={palette.oob} />}
      </RoundedBox>
      <mesh position={[0, -0.012, D / 2 + 0.0006]}>
        <planeGeometry args={[W - 0.02, 0.03]} />
        <meshStandardMaterial color="#cfc9bc" roughness={0.7} metalness={0} />
      </mesh>
      <Led
        position={[0, 0.03, D / 2]}
        size={0.0045}
        colorOf={() => {
          const phase = useAppStore.getState().alarmPhase
          if (isEscalating(phase)) return palette.alarm
          if (phase === 'drifting') return palette.amber
          return palette.ledOn
        }}
      />
      <Hotspot id="sensor" />
    </group>
  )
}
