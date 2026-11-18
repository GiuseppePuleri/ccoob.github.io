import { Outlines } from '@react-three/drei'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { selectLinkStatus } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'
import { Led } from './Led'

export function Sensor() {
  const bind = useDeviceInteraction('sensor')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'sensor' || state.selectedDevice === 'sensor',
  )

  return (
    <group position={stage.sensor} {...bind}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.028, 28]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.55} metalness={0.05} />
        {highlighted && <Outlines thickness={0.006} color={palette.oob} />}
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color={palette.plasticCool} roughness={0.4} metalness={0.1} />
      </mesh>
      <Led
        position={[0.028, 0.016, 0.02]}
        size={0.006}
        colorOf={() => {
          const phase = useAppStore.getState().alarmPhase
          if (phase === 'sms' || phase === 'call') return palette.alarm
          if (phase === 'drifting') return palette.amber
          return palette.ledOn
        }}
        activeOf={() => selectLinkStatus(useAppStore.getState(), 'lora') !== 'down'}
      />
      <Hotspot id="sensor" />
    </group>
  )
}
