import { signalPaths } from '../../config/devices'
import { palette } from '../../config/theme'
import { useAppStore } from '../../store/useAppStore'
import { WaveRibbon } from '../materials/waveMaterial'

function oobColor(): string {
  const phase = useAppStore.getState().alarmPhase
  if (phase === 'sms' || phase === 'call') return palette.alarm
  if (phase === 'drifting') return palette.amber
  return palette.oob
}

/** Onde che nascono nel sensore, attraversano la porta e arrivano al gateway. */
export function LoraWaves() {
  return (
    <group>
      <WaveRibbon points={signalPaths.lora} phase={0} radius={0.012} colorOf={oobColor} />
      <WaveRibbon points={signalPaths.lora} phase={0.48} radius={0.006} intensity={1.8} speed={1.15} colorOf={oobColor} />
    </group>
  )
}
