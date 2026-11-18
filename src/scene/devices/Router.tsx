import { Outlines } from '@react-three/drei'
import { stage } from '../../config/devices'
import { palette } from '../../config/theme'
import { selectLinkStatus } from '../../store/selectors'
import { useAppStore } from '../../store/useAppStore'
import { Hotspot } from '../interaction/Hotspot'
import { useDeviceInteraction } from '../interaction/useDeviceInteraction'
import { Led } from './Led'

/** Il router è l'unico elemento della rete nativa. Spento, il Wi-Fi scompare. */
export function Router() {
  const bind = useDeviceInteraction('router')
  const highlighted = useAppStore(
    (state) => state.hoveredDevice === 'router' || state.selectedDevice === 'router',
  )
  const online = () => selectLinkStatus(useAppStore.getState(), 'wifi') !== 'down'

  return (
    <group position={stage.router} {...bind}>
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.045, 0.15]} />
        <meshStandardMaterial color={palette.plastic} roughness={0.52} metalness={0.06} />
        {highlighted && <Outlines thickness={0.007} color={palette.wifi} />}
      </mesh>
      <mesh position={[-0.05, 0.1, -0.03]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />
        <meshStandardMaterial color="#b0b6be" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0.05, 0.12, -0.03]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.15, 8]} />
        <meshStandardMaterial color="#b0b6be" metalness={0.85} roughness={0.28} />
      </mesh>
      <Led position={[-0.07, 0.05, 0.076]} colorOf={() => palette.ledOn} activeOf={online} />
      <Led position={[-0.04, 0.05, 0.076]} colorOf={() => palette.wifi} activeOf={online} />
      <Hotspot id="router" />
    </group>
  )
}
